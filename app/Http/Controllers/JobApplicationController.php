<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreJobApplicationRequest;
use App\Mail\JobApplicationReceived;
use App\Models\JobApplication;
use App\Models\JobListing;
use App\Models\SiteSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class JobApplicationController extends Controller
{
    /**
     * Submit a job application for a listing.
     */
    public function store(StoreJobApplicationRequest $request, JobListing $jobListing): RedirectResponse
    {
        $application = JobApplication::query()->create([
            ...$request->safe()->except('resume'),
            'job_listing_id' => $jobListing->id,
            'resume_path' => $request->file('resume')->store('resumes', 'public'),
        ]);

        Mail::to(SiteSetting::get('email', config('mail.from.address')))
            ->queue(new JobApplicationReceived($application));

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Application submitted. We will be in touch soon!')]);

        return back();
    }
}
