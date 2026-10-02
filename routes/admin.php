<?php

use App\Http\Controllers\Admin\ApplicationRequirementController;
use App\Http\Controllers\Admin\AssessmentAttemptController;
use App\Http\Controllers\Admin\AssessmentController;
use App\Http\Controllers\Admin\AssessmentQuestionController;
use App\Http\Controllers\Admin\BackgroundCheckController;
use App\Http\Controllers\Admin\BlogPostController;
use App\Http\Controllers\Admin\CandidateController;
use App\Http\Controllers\Admin\CommunicationTemplateController;
use App\Http\Controllers\Admin\ComplianceController;
use App\Http\Controllers\Admin\CredentialController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\EmployeeController;
use App\Http\Controllers\Admin\FacilityController;
use App\Http\Controllers\Admin\InterviewController;
use App\Http\Controllers\Admin\InterviewQuestionController;
use App\Http\Controllers\Admin\JobApplicationController;
use App\Http\Controllers\Admin\JobListingController;
use App\Http\Controllers\Admin\OfferController;
use App\Http\Controllers\Admin\OnboardingChecklistTemplateController;
use App\Http\Controllers\Admin\OnboardingChecklistTemplateItemController;
use App\Http\Controllers\Admin\PageController;
use App\Http\Controllers\Admin\ReferenceCheckController;
use App\Http\Controllers\Admin\ServiceController;
use App\Http\Controllers\Admin\ShiftAssignmentController;
use App\Http\Controllers\Admin\ShiftController;
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
        Route::resource('interview-questions', InterviewQuestionController::class)->except(['show']);
        Route::get('interviews', [InterviewController::class, 'index'])->name('interviews.index');
        Route::get('interviews/{interview}', [InterviewController::class, 'show'])->name('interviews.show');
        Route::put('interviews/{interview}', [InterviewController::class, 'update'])->name('interviews.update');
        Route::post('job-applications/{application}/interviews', [InterviewController::class, 'store'])->name('job-applications.interviews.store');
        Route::put('credentials/{credential}/verify', [CredentialController::class, 'verify'])->name('credentials.verify');
        Route::put('credentials/{credential}/reject', [CredentialController::class, 'reject'])->name('credentials.reject');
        Route::put('application-requirements/{applicationRequirement}', [ApplicationRequirementController::class, 'update'])->name('application-requirements.update');
        Route::post('employment-history/{employmentHistory}/reference-checks', [ReferenceCheckController::class, 'store'])->name('employment-history.reference-checks.store');
        Route::post('job-applications/{application}/background-checks', [BackgroundCheckController::class, 'store'])->name('job-applications.background-checks.store');
        Route::put('background-checks/{backgroundCheck}', [BackgroundCheckController::class, 'update'])->name('background-checks.update');
        Route::resource('assessments', AssessmentController::class)->except(['show']);
        Route::resource('assessments.questions', AssessmentQuestionController::class)->except(['show'])->shallow();
        Route::get('assessment-attempts', [AssessmentAttemptController::class, 'index'])->name('assessment-attempts.index');
        Route::get('assessment-attempts/{assessmentAttempt}', [AssessmentAttemptController::class, 'show'])->name('assessment-attempts.show');
        Route::put('assessment-attempts/{assessmentAttempt}', [AssessmentAttemptController::class, 'update'])->name('assessment-attempts.update');
        Route::post('job-applications/{application}/assessment-attempts', [AssessmentAttemptController::class, 'store'])->name('job-applications.assessment-attempts.store');
        Route::post('job-applications/{application}/offers', [OfferController::class, 'store'])->name('job-applications.offers.store');
        Route::put('offers/{offer}', [OfferController::class, 'update'])->name('offers.update');
        Route::resource('onboarding-checklist-templates', OnboardingChecklistTemplateController::class)->except(['show']);
        Route::resource('onboarding-checklist-templates.items', OnboardingChecklistTemplateItemController::class)->except(['show'])->shallow();
        Route::get('employees', [EmployeeController::class, 'index'])->name('employees.index');
        Route::get('employees/{employee}', [EmployeeController::class, 'show'])->name('employees.show');
        Route::get('compliance', [ComplianceController::class, 'index'])->name('compliance.index');
        Route::resource('facilities', FacilityController::class)->except(['show']);
        Route::resource('facilities.shifts', ShiftController::class)->shallow();
        Route::post('shifts/{shift}/assignments', [ShiftAssignmentController::class, 'store'])->name('shifts.assignments.store');
        Route::put('shift-assignments/{shiftAssignment}', [ShiftAssignmentController::class, 'update'])->name('shift-assignments.update');
    });
    Route::resource('blog-posts', BlogPostController::class)->except(['show'])->middleware('permission:manage-blog');
    Route::resource('testimonials', TestimonialController::class)->except(['show'])->middleware('permission:manage-testimonials');
    Route::resource('stats', StatController::class)->except(['show'])->middleware('permission:manage-stats');
    Route::resource('staffing-requests', StaffingRequestController::class)->only(['index', 'show', 'update'])->middleware('permission:manage-leads');
    Route::resource('users', UserController::class)->except(['show'])->middleware('permission:manage-users');
});
