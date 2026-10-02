<?php

namespace App\Http\Controllers\Admin;

use App\Actions\TransitionApplicationStatus;
use App\Enums\ApplicationStatus;
use App\Exceptions\BlockingRequirementsIncompleteException;
use App\Exceptions\InvalidApplicationTransitionException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AssignApplicationRecruiterRequest;
use App\Http\Requests\Admin\SendApplicationMessageRequest;
use App\Http\Requests\Admin\UpdateJobApplicationStatusRequest;
use App\Mail\CandidateMessage;
use App\Models\Application;
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
    public function update(UpdateJobApplicationStatusRequest $request, Application $application, TransitionApplicationStatus $transition): RedirectResponse
    {
        try {
            $transition->handle(
                $application,
                ApplicationStatus::from($request->validated('status')),
                actor: $request->user(),
                reason: $request->validated('reason'),
                reasonCode: $request->validated('reason_code'),
            );
        } catch (InvalidApplicationTransitionException|BlockingRequirementsIncompleteException $exception) {
            Inertia::flash('toast', ['type' => 'error', 'message' => $exception->getMessage()]);

            return to_route('admin.candidates.show', $application->candidate_id);
        }

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
}
