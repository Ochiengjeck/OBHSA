<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreJobApplicationRequest;
use App\Mail\JobApplicationReceived;
use App\Models\JobListing;
use App\Models\SiteSetting;
use App\Services\JobApplicationIntakeService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class JobApplicationController extends Controller
{
    /**
     * Submit a job application for a listing.
     */
    public function store(StoreJobApplicationRequest $request, JobListing $jobListing, JobApplicationIntakeService $intake): RedirectResponse
    {
        $application = $intake->submit(
            $request->validated('full_name'),
            $request->validated('email'),
            $request->validated('phone'),
            $request->validated('cover_note'),
            $jobListing,
            $request->file('resume'),
            $request->ip(),
            $request->userAgent(),
        );

        Mail::to(SiteSetting::get('email', config('mail.from.address')))
            ->queue(new JobApplicationReceived($application));

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Application submitted. We will be in touch soon!')]);

        return back();
    }
}
