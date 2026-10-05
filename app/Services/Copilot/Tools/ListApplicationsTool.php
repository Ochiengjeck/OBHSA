<?php

namespace App\Services\Copilot\Tools;

use App\Enums\ApplicationStatus;
use App\Models\Application;
use App\Models\User;
use App\Services\Copilot\Contracts\CopilotTool;
use App\Services\Copilot\Tools\Concerns\AuthorizesViaPermission;

/**
 * Read-only — lists applications in aggregate across all candidates, unlike
 * every other tool here which operates on one named/ID'd candidate. Exists
 * so the copilot can answer "what needs my action?" style questions.
 */
class ListApplicationsTool implements CopilotTool
{
    use AuthorizesViaPermission;

    private const int DEFAULT_LIMIT = 20;

    private const int MAX_LIMIT = 50;

    public function name(): string
    {
        return 'list_applications';
    }

    public function description(): string
    {
        return 'List applications across all candidates, optionally filtered by status or by having no recruiter '
            .'assigned yet. When no status is given, defaults to open/in-progress applications (excludes '
            .'terminal statuses like active, withdrawn, rejected, ineligible, expired). Returns up to 50 results.';
    }

    public function parameters(): array
    {
        return [
            'type' => 'object',
            'properties' => [
                'status' => [
                    'type' => 'string',
                    'enum' => array_column(ApplicationStatus::cases(), 'value'),
                    'description' => 'Filter to one specific status. Omit to use the default (all non-terminal, in-progress statuses).',
                ],
                'unassigned_only' => [
                    'type' => 'boolean',
                    'description' => 'If true, only return applications with no recruiter assigned yet.',
                ],
                'limit' => [
                    'type' => 'integer',
                    'description' => 'Max rows to return (default 20, hard cap 50).',
                ],
            ],
            'required' => [],
        ];
    }

    public function requiresConfirmation(): bool
    {
        return false;
    }

    protected function permission(): string
    {
        return 'applications.view';
    }

    public function execute(User $user, array $arguments): array
    {
        $status = $arguments['status'] ?? null;
        $unassignedOnly = (bool) ($arguments['unassigned_only'] ?? false);
        $limit = min((int) ($arguments['limit'] ?? self::DEFAULT_LIMIT), self::MAX_LIMIT);

        $terminalStatuses = array_map(
            fn (ApplicationStatus $case) => $case->value,
            array_filter(ApplicationStatus::cases(), fn (ApplicationStatus $case) => $case->isTerminal()),
        );

        $applications = Application::query()
            ->with(['candidate:id,full_name', 'jobListing:id,title', 'recruiter:id,name'])
            ->when(
                $status !== null,
                fn ($query) => $query->where('status', $status),
                fn ($query) => $query->whereNotIn('status', $terminalStatuses),
            )
            ->when($unassignedOnly, fn ($query) => $query->whereNull('assigned_recruiter_id'))
            ->latest()
            ->limit($limit)
            ->get();

        return [
            'count' => $applications->count(),
            'truncated' => $applications->count() >= $limit,
            'applications' => $applications->map(fn (Application $application) => [
                'id' => $application->id,
                'candidate' => [
                    'id' => $application->candidate?->id,
                    'full_name' => $application->candidate?->full_name,
                ],
                'job_listing' => $application->jobListing?->title,
                'status' => $application->status,
                'assigned_recruiter' => $application->recruiter?->name,
            ])->all(),
        ];
    }
}
