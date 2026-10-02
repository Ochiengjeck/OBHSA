<?php

namespace App\Services\Copilot\Tools;

use App\Models\Application;
use App\Models\User;
use App\Services\Copilot\Contracts\CopilotTool;

/**
 * Write, requires confirmation — wraps
 * Admin\JobApplicationController::assignRecruiter().
 */
class AssignRecruiterTool implements CopilotTool
{
    public function name(): string
    {
        return 'assign_recruiter';
    }

    public function description(): string
    {
        return 'Assign (or unassign) the recruiter responsible for an application.';
    }

    public function parameters(): array
    {
        return [
            'type' => 'object',
            'properties' => [
                'application_id' => ['type' => 'integer', 'description' => 'The application\'s id.'],
                'recruiter_id' => ['type' => ['integer', 'null'], 'description' => 'The recruiter\'s user id, or null to unassign.'],
            ],
            'required' => ['application_id'],
        ];
    }

    public function requiresConfirmation(): bool
    {
        return true;
    }

    public function authorize(User $user): bool
    {
        return $user->can('manage-applications');
    }

    public function execute(User $user, array $arguments): array
    {
        $application = Application::query()->findOrFail((int) $arguments['application_id']);

        $recruiterId = $arguments['recruiter_id'] ?? null;

        if ($recruiterId !== null && ! User::query()->whereKey($recruiterId)->exists()) {
            return ['success' => false, 'message' => "No user with id {$recruiterId} exists."];
        }

        $application->update(['assigned_recruiter_id' => $recruiterId]);

        return ['success' => true, 'message' => "Application #{$application->id}'s recruiter was updated."];
    }
}
