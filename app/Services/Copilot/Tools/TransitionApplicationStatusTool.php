<?php

namespace App\Services\Copilot\Tools;

use App\Actions\TransitionApplicationStatus;
use App\Enums\ApplicationStatus;
use App\Exceptions\BlockingRequirementsIncompleteException;
use App\Exceptions\InvalidApplicationTransitionException;
use App\Models\Application;
use App\Models\User;
use App\Services\Copilot\Contracts\CopilotTool;
use ValueError;

/**
 * Write, requires confirmation — wraps the exact
 * Admin\JobApplicationController::update() path (via the shared
 * TransitionApplicationStatus action), including the activation gate.
 */
class TransitionApplicationStatusTool implements CopilotTool
{
    public function name(): string
    {
        return 'transition_application_status';
    }

    public function description(): string
    {
        return 'Change an application\'s status. Subject to the same legal-transition rules and activation gate as the admin review screen.';
    }

    public function parameters(): array
    {
        return [
            'type' => 'object',
            'properties' => [
                'application_id' => ['type' => 'integer', 'description' => 'The application\'s id.'],
                'status' => ['type' => 'string', 'description' => 'The target status value, e.g. "rejected" or "on_hold".'],
                'reason' => ['type' => 'string', 'description' => 'Optional free-text reason.'],
            ],
            'required' => ['application_id', 'status'],
        ];
    }

    public function requiresConfirmation(): bool
    {
        return true;
    }

    public function authorize(User $user): bool
    {
        return $user->can('applications.update');
    }

    public function execute(User $user, array $arguments): array
    {
        $application = Application::query()->findOrFail((int) $arguments['application_id']);

        try {
            $to = ApplicationStatus::from((string) $arguments['status']);
        } catch (ValueError) {
            return ['success' => false, 'message' => "\"{$arguments['status']}\" is not a recognized application status."];
        }

        try {
            app(TransitionApplicationStatus::class)->handle(
                $application,
                $to,
                actor: $user,
                reason: $arguments['reason'] ?? null,
                reasonCode: 'copilot',
            );
        } catch (InvalidApplicationTransitionException|BlockingRequirementsIncompleteException $exception) {
            return ['success' => false, 'message' => $exception->getMessage()];
        }

        return ['success' => true, 'message' => "Application #{$application->id} is now \"{$to->value}\"."];
    }
}
