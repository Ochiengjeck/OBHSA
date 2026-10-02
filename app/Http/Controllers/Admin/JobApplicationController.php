<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ApplicationStatus;
use App\Exceptions\BlockingRequirementsIncompleteException;
use App\Exceptions\InvalidApplicationTransitionException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AssignApplicationRecruiterRequest;
use App\Http\Requests\Admin\SendApplicationMessageRequest;
use App\Http\Requests\Admin\UpdateJobApplicationStatusRequest;
use App\Mail\CandidateMessage;
use App\Models\Application;
use App\Models\Employee;
use App\Models\OnboardingChecklistTemplate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class JobApplicationController extends Controller
{
    /**
     * List job applications, optionally filtered by status.
     */
    public function index(Request $request): Response
    {
        $applications = Application::query()
            ->with(['candidate:id,full_name,email', 'jobListing:id,title', 'recruiter:id,name'])
            ->when($request->string('status')->isNotEmpty(), fn ($query) => $query->where('status', $request->string('status')))
            ->latest()
            ->paginate(20)
            ->withQueryString()
            ->through(fn (Application $application) => [
                ...$application->toArray(),
                'days_in_stage' => $application->current_stage_entered_at?->diffInDays(now()),
            ]);

        return Inertia::render('admin/job-applications/index', [
            'applications' => $applications,
            'filters' => ['status' => $request->string('status')->value() ?: null],
            'statusOptions' => array_map(
                fn (ApplicationStatus $status) => ['value' => $status->value, 'label' => $status->label()],
                ApplicationStatus::cases(),
            ),
            'statusCounts' => Application::query()
                ->selectRaw('status, count(*) as count')
                ->groupBy('status')
                ->pluck('count', 'status'),
        ]);
    }

    /**
     * Update a job application's review status.
     */
    public function update(UpdateJobApplicationStatusRequest $request, Application $application): RedirectResponse
    {
        $to = ApplicationStatus::from($request->validated('status'));

        try {
            if ($to === ApplicationStatus::Active) {
                $this->assertActivationAllowed($application);
            }

            $application->transitionTo(
                $to,
                actor: $request->user(),
                reason: $request->validated('reason'),
                reasonCode: $request->validated('reason_code') ?? 'admin_review',
            );
        } catch (InvalidApplicationTransitionException|BlockingRequirementsIncompleteException $exception) {
            Inertia::flash('toast', ['type' => 'error', 'message' => $exception->getMessage()]);

            return to_route('admin.candidates.show', $application->candidate_id);
        }

        $this->applyPostTransitionEffects($application, $to);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Application status updated.')]);

        return to_route('admin.candidates.show', $application->candidate_id);
    }

    /**
     * Assign (or unassign) the recruiter responsible for an application.
     */
    public function assignRecruiter(AssignApplicationRecruiterRequest $request, Application $application): RedirectResponse
    {
        $application->update(['assigned_recruiter_id' => $request->validated('assigned_recruiter_id')]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Recruiter updated.')]);

        return to_route('admin.candidates.show', $application->candidate_id);
    }

    /**
     * Send a message to the candidate and log it against the application.
     */
    public function sendMessage(SendApplicationMessageRequest $request, Application $application): RedirectResponse
    {
        $application->communications()->create([
            'communication_template_id' => $request->validated('communication_template_id'),
            'sent_by' => $request->user()->id,
            'subject' => $request->validated('subject'),
            'body' => $request->validated('body'),
        ]);

        Mail::to($application->candidate->email)
            ->queue(new CandidateMessage($application, $request->validated('subject'), $request->validated('body')));

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Message sent.')]);

        return to_route('admin.candidates.show', $application->candidate_id);
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
