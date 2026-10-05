<?php

namespace App\Services\Copilot\Tools;

use App\Enums\ApplicationStatus;
use App\Models\Application;
use App\Models\User;
use App\Services\Copilot\Contracts\CopilotTool;
use App\Services\Copilot\Tools\Concerns\AuthorizesViaPermission;

/**
 * Read-only — a labeled, zero-filled breakdown of applications per
 * pipeline stage, reusing the exact query shape
 * Admin\DashboardController::pipelineOverview() already renders on the
 * admin dashboard.
 */
class ApplicationsSummaryTool implements CopilotTool
{
    use AuthorizesViaPermission;

    public function name(): string
    {
        return 'applications_summary';
    }

    public function description(): string
    {
        return 'Get a summary of applications: a count per pipeline stage (excluding terminal outcomes like '
            .'active/withdrawn/rejected/ineligible/expired).';
    }

    public function parameters(): array
    {
        return ['type' => 'object', 'properties' => [], 'required' => []];
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
        $counts = Application::query()
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');

        $pipeline = collect(ApplicationStatus::cases())
            ->reject(fn (ApplicationStatus $status) => $status->isTerminal())
            ->map(fn (ApplicationStatus $status) => [
                'status' => $status->value,
                'label' => $status->label(),
                'count' => (int) $counts->get($status->value, 0),
            ])
            ->values()
            ->all();

        return ['pipeline' => $pipeline, 'total_open' => array_sum(array_column($pipeline, 'count'))];
    }
}
