<?php

namespace App\Actions;

use App\Enums\ApplicationStatus;
use App\Exceptions\BlockingRequirementsIncompleteException;
use App\Exceptions\InvalidApplicationTransitionException;
use App\Models\Application;
use App\Models\Employee;
use App\Models\OnboardingChecklistTemplate;
use App\Models\User;

/**
 * Transition an application's status, enforcing the activation gate and
 * applying every status's post-transition side effects. The sole entry
 * point for a manual status change — shared by the admin HTTP endpoint
 * and the AI copilot's equivalent tool, so the two can never drift.
 */
class TransitionApplicationStatus
{
    /**
     * @throws BlockingRequirementsIncompleteException|InvalidApplicationTransitionException
     */
    public function handle(
        Application $application,
        ApplicationStatus $to,
        ?User $actor = null,
        ?string $reason = null,
        ?string $reasonCode = null,
    ): void {
        if ($to === ApplicationStatus::Active) {
            $this->assertActivationAllowed($application);
        }

        $application->transitionTo(
            $to,
            actor: $actor,
            reason: $reason,
            reasonCode: $reasonCode ?? 'admin_review',
        );

        $this->applyPostTransitionEffects($application, $to);
    }

    /**
     * The deterministic activation-eligibility gate: an application can
     * only become active once every blocking requirement has passed.
     */
    private function assertActivationAllowed(Application $application): void
    {
        $incomplete = $application->requirements()
            ->where('is_blocking', true)
            ->where('status', '!=', 'passed')
            ->pluck('requirement_type');

        if ($incomplete->isNotEmpty()) {
            throw BlockingRequirementsIncompleteException::make($incomplete);
        }
    }

    /**
     * Side effects that only happen once a transition actually succeeds:
     * instantiating the default onboarding checklist, and creating the
     * Employee record the moment an application goes active.
     */
    private function applyPostTransitionEffects(Application $application, ApplicationStatus $to): void
    {
        if ($to === ApplicationStatus::Onboarding) {
            $template = OnboardingChecklistTemplate::query()
                ->where('is_default', true)
                ->where('is_active', true)
                ->first();

            if ($template) {
                foreach ($template->items as $item) {
                    $application->requirements()->firstOrCreate(
                        ['requirement_type' => "onboarding:{$item->task_key}"],
                        ['is_blocking' => $item->is_blocking],
                    );
                }
            }
        }

        if ($to === ApplicationStatus::Active) {
            $employee = Employee::query()->firstOrCreate(
                ['candidate_id' => $application->candidate_id],
                [
                    'application_id' => $application->id,
                    'hire_date' => now()->toDateString(),
                    'specialty' => $application->primary_specialty,
                    'pay_rate' => $application->offers()->where('status', 'accepted')->latest()->first()?->pay_rate,
                ],
            );

            $employee->assignEmployeeNumber();
        }
    }
}
