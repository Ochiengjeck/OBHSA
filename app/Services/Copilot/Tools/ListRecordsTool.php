<?php

namespace App\Services\Copilot\Tools;

use App\Models\User;
use App\Services\Copilot\Contracts\CopilotTool;
use App\Services\Copilot\Support\ResourceRegistry;

/**
 * Read-only — a generic "list records" tool covering every admin resource
 * that isn't already served by a dedicated tool (applications/candidates
 * stay on ListApplicationsTool/SearchCandidatesTool/GetCandidateDossierTool).
 * One class instead of one per resource; see ResourceRegistry for the
 * per-resource column/relation whitelist.
 */
class ListRecordsTool implements CopilotTool
{
    private const int DEFAULT_LIMIT = 20;

    private const int MAX_LIMIT = 50;

    public function name(): string
    {
        return 'list_records';
    }

    public function description(): string
    {
        $resources = implode(', ', array_keys(ResourceRegistry::readable()));

        return "List records from one admin resource. Available resources: {$resources}. "
            .'Returns up to 50 results.';
    }

    public function parameters(): array
    {
        return [
            'type' => 'object',
            'properties' => [
                'resource' => [
                    'type' => 'string',
                    'enum' => array_keys(ResourceRegistry::readable()),
                    'description' => 'Which resource to list.',
                ],
                'limit' => [
                    'type' => 'integer',
                    'description' => 'Max rows to return (default 20, hard cap 50).',
                ],
            ],
            'required' => ['resource'],
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

        $limit = min((int) ($arguments['limit'] ?? self::DEFAULT_LIMIT), self::MAX_LIMIT);

        $records = $entry['model']::query()
            ->select($entry['columns'])
            ->with($entry['with'])
            ->limit($limit)
            ->get();

        return [
            'resource' => $arguments['resource'],
            'count' => $records->count(),
            'truncated' => $records->count() >= $limit,
            'records' => $records->toArray(),
        ];
    }
}
