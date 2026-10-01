<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateJobApplicationStatusRequest;
use App\Models\JobApplication;
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
        $applications = JobApplication::query()
            ->with('jobListing:id,title')
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
    public function show(JobApplication $jobApplication): Response
    {
        $jobApplication->load('jobListing:id,title', 'reviewer:id,name');

        return Inertia::render('admin/job-applications/show', [
            'application' => $jobApplication,
            'resumeUrl' => Storage::disk('public')->url($jobApplication->resume_path),
        ]);
    }

    /**
     * Update a job application's review status.
     */
    public function update(UpdateJobApplicationStatusRequest $request, JobApplication $jobApplication): RedirectResponse
    {
        $jobApplication->update([
            'status' => $request->validated('status'),
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Application status updated.')]);

        return to_route('admin.job-applications.show', $jobApplication);
    }
}
