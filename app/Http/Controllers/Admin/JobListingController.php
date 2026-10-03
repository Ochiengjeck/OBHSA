<?php

namespace App\Http\Controllers\Admin;

use App\Concerns\StoresUploadedFiles;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreJobListingRequest;
use App\Http\Requests\Admin\UpdateJobListingRequest;
use App\Models\JobListing;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class JobListingController extends Controller
{
    use StoresUploadedFiles;

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
        $jobListing = JobListing::query()->create([
            ...$request->safe()->except('image'),
            'posted_at' => now(),
        ]);

        if ($request->hasFile('image')) {
            $jobListing->update(['image_path' => $this->storePublicFile($request->file('image'), 'job-listings')]);
        }

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
        $jobListing->fill($request->safe()->except('image'));

        if ($request->hasFile('image')) {
            if ($jobListing->image_path) {
                Storage::disk('public')->delete($jobListing->image_path);
            }

            $jobListing->image_path = $this->storePublicFile($request->file('image'), 'job-listings');
        }

        $jobListing->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Job listing updated.')]);

        return to_route('admin.job-listings.index');
    }

    /**
     * Delete a job listing.
     */
    public function destroy(JobListing $jobListing): RedirectResponse
    {
        if ($jobListing->image_path) {
            Storage::disk('public')->delete($jobListing->image_path);
        }

        $jobListing->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Job listing deleted.')]);

        return to_route('admin.job-listings.index');
    }
}
