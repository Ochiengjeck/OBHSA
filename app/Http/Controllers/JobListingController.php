<?php

namespace App\Http\Controllers;

use App\Models\JobListing;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class JobListingController extends Controller
{
    /**
     * List open job listings, optionally filtered.
     */
    public function index(Request $request): Response
    {
        $listings = JobListing::query()
            ->active()
            ->when($request->string('specialty')->isNotEmpty(), fn ($query) => $query->where('specialty', $request->string('specialty')))
            ->when($request->string('employment_type')->isNotEmpty(), fn ($query) => $query->where('employment_type', $request->string('employment_type')))
            ->when($request->string('location_city')->isNotEmpty(), fn ($query) => $query->where('location_city', $request->string('location_city')))
            ->latest('posted_at')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('public/jobs/index', [
            'listings' => $listings,
            'filters' => $request->only(['specialty', 'employment_type', 'location_city']),
            'specialties' => JobListing::query()->active()->distinct()->pluck('specialty'),
            'cities' => JobListing::query()->active()->distinct()->pluck('location_city'),
        ]);
    }

    /**
     * Show a single job listing.
     */
    public function show(JobListing $jobListing): Response
    {
        return Inertia::render('public/jobs/show', [
            'jobListing' => $jobListing,
        ]);
    }
}
