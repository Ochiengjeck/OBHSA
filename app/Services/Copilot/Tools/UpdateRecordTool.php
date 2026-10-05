<?php

namespace App\Services\Copilot\Tools;

use App\Models\User;
use App\Services\Copilot\Contracts\CopilotTool;
use App\Services\Copilot\Support\ResourceRegistry;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Validator;
use ReflectionMethod;

/**
 * Write, requires confirmation — a generic "update one record" tool that
 * still goes through each resource's real validation rules, so it can't
 * bypass the business rules a human editing the same resource would be
 * held to. See ResourceRegistry::writable() for the exact resource set
 * and field whitelist.
 *
 * Every Update*Request in this app validates a full-form replacement
 * (required fields the real form always submits in full), not a partial
 * patch. So a partial `fields` payload is merged onto the record's
 * current values before validating, meaning required/cross-field rules
 * are checked against the complete intended end state rather than the
 * bare patch — letting a single-field change (e.g. "turn this off")
 * validate successfully instead of failing on unrelated required fields
 * it never meant to touch.
 */
class UpdateRecordTool implements CopilotTool
{
    public function name(): string
    {
        return 'update_record';
    }

    public function description(): string
    {
        $resources = implode(', ', array_keys(ResourceRegistry::writable()));

        return "Update one or more fields on an existing record. Available resources: {$resources}. "
            .'Only pass the fields you want to change — the rest stay as they are.';
    }

    public function parameters(): array
    {
        return [
            'type' => 'object',
            'properties' => [
                'resource' => [
                    'type' => 'string',
                    'enum' => array_keys(ResourceRegistry::writable()),
                    'description' => 'Which resource to update.',
                ],
                'id' => ['type' => 'integer', 'description' => 'The record\'s id.'],
                'fields' => [
                    'type' => 'object',
                    'description' => 'The fields to change, as field name => new value.',
                ],
            ],
            'required' => ['resource', 'id', 'fields'],
        ];
    }

    public function requiresConfirmation(): bool
    {
        return true;
    }

    public function requiredPermission(array $arguments): ?string
    {
        $resource = $arguments['resource'] ?? null;

        if ($resource === null || ! isset(ResourceRegistry::readable()[$resource], ResourceRegistry::writable()[$resource])) {
            return null;
        }

        return ResourceRegistry::readable()[$resource]['permission_prefix'].'.update';
    }

    public function authorize(User $user, array $arguments): bool
    {
        $permission = $this->requiredPermission($arguments);

        return $permission !== null && $user->can($permission);
    }

    public function execute(User $user, array $arguments): array
    {
        $resource = $arguments['resource'] ?? '';
        $writable = ResourceRegistry::writable()[$resource] ?? null;
        $readable = ResourceRegistry::readable()[$resource] ?? null;

        if ($writable === null || $readable === null) {
            return ['success' => false, 'message' => "\"{$resource}\" can't be updated this way."];
        }

        $record = $readable['model']::query()->find((int) $arguments['id']);

        if ($record === null) {
            return ['success' => false, 'message' => "No \"{$resource}\" record with id {$arguments['id']}."];
        }

        $updatableFields = $writable['updatable_fields'];
        $merged = array_merge($record->only($updatableFields), (array) ($arguments['fields'] ?? []));

        /** @var class-string<FormRequest> $requestClass */
        $requestClass = $writable['update_request'];
        // FormRequest doesn't declare rules() itself — every subclass just
        // defines it ad hoc with no shared interface — so it's invoked by
        // reflection rather than a static method reference.
        $rules = (new ReflectionMethod($requestClass, 'rules'))->invoke(new $requestClass);
        $validator = Validator::make($merged, $rules);

        if ($validator->fails()) {
            return ['success' => false, 'errors' => $validator->errors()->toArray()];
        }

        $validated = array_intersect_key($validator->validated(), array_flip($updatableFields));

        $record->update($validated);

        return ['success' => true, 'message' => "Updated {$resource} #{$record->getKey()}."];
    }
}
