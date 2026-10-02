<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ApplicationStatus;
use App\Exceptions\InvalidApplicationTransitionException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateJobApplicationStatusRequest;
use App\Models\Application;
use App\Support\ApplicationStateMachine;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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
            ->with(['candidate:id,full_name,email', 'jobListing:id,title'])
            ->when($request->string('status')->isNotEmpty(), fn ($query) => $query->where('status', $request->string('status')))
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('admin/job-applications/index', [
            'applications' => $applications,
            'filters' => ['status' => $request->string('status')->value() ?: null],
        ]);
    }

    /**
     * Show a single job application.
     */
    public function show(Application $application): Response
    {
        $application->load([
            'candidate',
            'jobListing:id,title',
            'requirements',
            'stageHistory.changedBy:id,name',
        ]);

        $resume = $application->documents()
            ->where('document_type', 'resume')
            ->latest('version')
            ->first();

        return Inertia::render('admin/job-applications/show', [
            'application' => $application,
            'resumeUrl' => $resume ? Storage::disk($resume->disk)->url($resume->file_path) : null,
            'allowedStatuses' => array_map(
                fn (ApplicationStatus $status) => ['value' => $status->value, 'label' => $status->label()],
                ApplicationStateMachine::allowedFrom(ApplicationStatus::from($application->status)),
            ),
        ]);
    }

    /**
     * Update a job application's review status.
     */
    public function update(UpdateJobApplicationStatusRequest $request, Application $application): RedirectResponse
    {
        try {
            $application->transitionTo(
                ApplicationStatus::from($request->validated('status')),
                actor: $request->user(),
                reason: $request->validated('reason'),
                reasonCode: 'admin_review',
            );
        } catch (InvalidApplicationTransitionException $exception) {
            Inertia::flash('toast', ['type' => 'error', 'message' => $exception->getMessage()]);

            return to_route('admin.job-applications.show', $application);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Application status updated.')]);

        return to_route('admin.job-applications.show', $application);
    }
}
