<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreJobListingRequest;
use App\Http\Requests\Admin\UpdateJobListingRequest;
use App\Models\JobListing;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class JobListingController extends Controller
{
    /**
     * List all job listings.
     */
    public function index(): Response
    {
        return Inertia::render('admin/job-listings/index', [
            'jobListings' => JobListing::query()->latest('posted_at')->get(),
        ]);
    }

    /**
     * Show the form to create a new job listing.
     */
    public function create(): Response
    {
        return Inertia::render('admin/job-listings/create');
    }

    /**
     * Store a new job listing.
     */
    public function store(StoreJobListingRequest $request): RedirectResponse
    {
        JobListing::query()->create([...$request->validated(), 'posted_at' => now()]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Job listing created.')]);

        return to_route('admin.job-listings.index');
    }

    /**
     * Show the form to edit a job listing.
     */
    public function edit(JobListing $jobListing): Response
    {
        return Inertia::render('admin/job-listings/edit', [
            'jobListing' => $jobListing,
        ]);
    }

    /**
     * Update a job listing.
     */
    public function update(UpdateJobListingRequest $request, JobListing $jobListing): RedirectResponse
    {
        $jobListing->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Job listing updated.')]);

        return to_route('admin.job-listings.index');
    }

    /**
     * Delete a job listing.
     */
    public function destroy(JobListing $jobListing): RedirectResponse
    {
        $jobListing->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Job listing deleted.')]);

        return to_route('admin.job-listings.index');
    }
}
