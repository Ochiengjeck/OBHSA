<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ApplicationStatus;
use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\BlogPost;
use App\Models\JobListing;
use App\Models\StaffingRequest;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Show the backoffice dashboard overview.
     */
    public function index(): Response
    {
        return Inertia::render('admin/dashboard', [
            'counts' => [
                'newApplications' => Application::query()->where('status', ApplicationStatus::Submitted->value)->count(),
                'newLeads' => StaffingRequest::query()->where('status', 'new')->count(),
                'activeJobListings' => JobListing::query()->where('is_active', true)->count(),
                'publishedPosts' => BlogPost::query()->where('is_published', true)->count(),
            ],
        ]);
    }
}
