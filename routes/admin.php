<?php

use App\Http\Controllers\Admin\BlogPostController;
use App\Http\Controllers\Admin\CandidateController;
use App\Http\Controllers\Admin\CommunicationTemplateController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\JobApplicationController;
use App\Http\Controllers\Admin\JobListingController;
use App\Http\Controllers\Admin\PageController;
use App\Http\Controllers\Admin\ServiceController;
use App\Http\Controllers\Admin\SiteSettingController;
use App\Http\Controllers\Admin\StaffingRequestController;
use App\Http\Controllers\Admin\StatController;
use App\Http\Controllers\Admin\TestimonialController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->name('admin.')->middleware(['auth', 'verified', 'role:admin|editor'])->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    Route::middleware('permission:manage-site-settings')->group(function () {
        Route::get('site-settings', [SiteSettingController::class, 'index'])->name('site-settings.index');
        Route::put('site-settings', [SiteSettingController::class, 'update'])->name('site-settings.update');
    });

    Route::resource('pages', PageController::class)->only(['index', 'edit', 'update'])->middleware('permission:manage-pages');
    Route::resource('services', ServiceController::class)->except(['show'])->middleware('permission:manage-services');
    Route::resource('job-listings', JobListingController::class)->except(['show'])->middleware('permission:manage-jobs');
    Route::middleware('permission:manage-applications')->group(function () {
        Route::resource('job-applications', JobApplicationController::class)
            ->only(['index', 'update'])
            ->parameters(['job-applications' => 'application']);
        Route::put('job-applications/{application}/recruiter', [JobApplicationController::class, 'assignRecruiter'])->name('job-applications.recruiter');
        Route::post('job-applications/{application}/message', [JobApplicationController::class, 'sendMessage'])->name('job-applications.message');
        Route::get('candidates/{candidate}', [CandidateController::class, 'show'])->name('candidates.show');
        Route::resource('communication-templates', CommunicationTemplateController::class)->except(['show']);
    });
    Route::resource('blog-posts', BlogPostController::class)->except(['show'])->middleware('permission:manage-blog');
    Route::resource('testimonials', TestimonialController::class)->except(['show'])->middleware('permission:manage-testimonials');
    Route::resource('stats', StatController::class)->except(['show'])->middleware('permission:manage-stats');
    Route::resource('staffing-requests', StaffingRequestController::class)->only(['index', 'show', 'update'])->middleware('permission:manage-leads');
    Route::resource('users', UserController::class)->except(['show'])->middleware('permission:manage-users');
});
