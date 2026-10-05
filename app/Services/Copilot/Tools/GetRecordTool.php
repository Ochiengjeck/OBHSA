<?php

namespace App\Services\Copilot\Tools;

use App\Models\User;
use App\Services\Copilot\Contracts\CopilotTool;
use App\Services\Copilot\Support\ResourceRegistry;

/**
 * Read-only — the single-record counterpart to ListRecordsTool. Same
 * resource registry, same column/relation whitelist.
 */
class GetRecordTool implements CopilotTool
{
    public function name(): string
    {
        return 'get_record';
    }

    public function description(): string
    {
        $resources = implode(', ', array_keys(ResourceRegistry::readable()));

        return "Get one record by id from an admin resource. Available resources: {$resources}.";
    }

    public function parameters(): array
    {
        return [
            'type' => 'object',
            'properties' => [
                'resource' => [
                    'type' => 'string',
                    'enum' => array_keys(ResourceRegistry::readable()),
                    'description' => 'Which resource to look up.',
                ],
                'id' => ['type' => 'integer', 'description' => 'The record\'s id.'],
            ],
            'required' => ['resource', 'id'],
        ];
    }

    public function requiresConfirmation(): bool
    {
        return false;
    }

    public function requiredPermission(array $arguments): ?string
    {
        $entry = ResourceRegistry::readable()[$arguments['resource'] ?? ''] ?? null;

        return $entry ? "{$entry['permission_prefix']}.view" : null;
    }

    public function authorize(User $user, array $arguments): bool
    {
        $permission = $this->requiredPermission($arguments);

        return $permission !== null && $user->can($permission);
    }

    public function execute(User $user, array $arguments): array
    {
        $entry = ResourceRegistry::readable()[$arguments['resource'] ?? ''] ?? null;

        if ($entry === null) {
            return ['success' => false, 'message' => "Unknown resource \"{$arguments['resource']}\"."];
        }

        $record = $entry['model']::query()
            ->select($entry['columns'])
            ->with($entry['with'])
            ->find((int) $arguments['id']);

        if ($record === null) {
            return ['success' => false, 'message' => "No \"{$arguments['resource']}\" record with id {$arguments['id']}."];
        }

        return ['resource' => $arguments['resource'], 'record' => $record->toArray()];
    }
}
