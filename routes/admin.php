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
use App\Http\Controllers\Admin\CopilotController;
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
use App\Http\Controllers\Admin\PolicyDocumentController;
use App\Http\Controllers\Admin\ReferenceCheckController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\ServiceController;
use App\Http\Controllers\Admin\ShiftAssignmentController;
use App\Http\Controllers\Admin\ShiftController;
use App\Http\Controllers\Admin\SiteSettingController;
use App\Http\Controllers\Admin\StaffingRequestController;
use App\Http\Controllers\Admin\StatController;
use App\Http\Controllers\Admin\TestimonialController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| CRUD-level permissions
|--------------------------------------------------------------------------
|
| Every admin resource is gated by up to four permissions named
| "<resource>.<action>" — view (index/show), create (create/store),
| update (edit/update), delete (destroy) — generated only for the actions
| a resource actually has a route for (e.g. Pages has no create/delete
| route, so it only gets .view/.update). A full CRUD resource uses
| ->middlewareFor() per action group; resources with no create/delete
| route (or a handful of one-off actions with no index/show of their own)
| use a single ->middleware('permission:...') per sub-group instead.
*/
Route::prefix('admin')->name('admin.')->middleware(['auth', 'verified', 'role:admin|editor'])->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    Route::middleware('permission:site-settings.view')->group(function () {
        Route::get('site-settings', [SiteSettingController::class, 'index'])->name('site-settings.index');
    });
    Route::put('site-settings', [SiteSettingController::class, 'update'])->name('site-settings.update')->middleware('permission:site-settings.update');

    Route::resource('pages', PageController::class)->only(['index', 'edit', 'update'])
        ->middlewareFor(['index'], 'permission:pages.view')
        ->middlewareFor(['edit', 'update'], 'permission:pages.update');

    Route::resource('services', ServiceController::class)->except(['show'])
        ->middlewareFor(['index'], 'permission:services.view')
        ->middlewareFor(['create', 'store'], 'permission:services.create')
        ->middlewareFor(['edit', 'update'], 'permission:services.update')
        ->middlewareFor(['destroy'], 'permission:services.delete');

    Route::resource('job-listings', JobListingController::class)->except(['show'])
        ->middlewareFor(['index'], 'permission:job-listings.view')
        ->middlewareFor(['create', 'store'], 'permission:job-listings.create')
        ->middlewareFor(['edit', 'update'], 'permission:job-listings.update')
        ->middlewareFor(['destroy'], 'permission:job-listings.delete');

    // Core application/candidate pipeline — sub-actions with no standalone
    // list page of their own (invoked only from within a candidate's
    // dossier) share the applications.* permissions: .create for actions
    // that start a new sub-record (reference check, background check,
    // offer), .update for everything else that progresses/modifies the
    // application. No applications.delete exists — nothing here is
    // destroyable.
    Route::middleware('permission:applications.view')->group(function () {
        Route::get('job-applications', [JobApplicationController::class, 'index'])->name('job-applications.index');
        Route::get('candidates/{candidate}', [CandidateController::class, 'show'])->name('candidates.show');
    });
    Route::middleware('permission:applications.update')->group(function () {
        Route::match(['PUT', 'PATCH'], 'job-applications/{application}', [JobApplicationController::class, 'update'])->name('job-applications.update');
        Route::put('job-applications/{application}/recruiter', [JobApplicationController::class, 'assignRecruiter'])->name('job-applications.recruiter');
        Route::post('job-applications/{application}/message', [JobApplicationController::class, 'sendMessage'])->name('job-applications.message');
        Route::put('credentials/{credential}/verify', [CredentialController::class, 'verify'])->name('credentials.verify');
        Route::put('credentials/{credential}/reject', [CredentialController::class, 'reject'])->name('credentials.reject');
        Route::put('application-requirements/{applicationRequirement}', [ApplicationRequirementController::class, 'update'])->name('application-requirements.update');
        Route::put('background-checks/{backgroundCheck}', [BackgroundCheckController::class, 'update'])->name('background-checks.update');
        Route::put('offers/{offer}', [OfferController::class, 'update'])->name('offers.update');
    });
    Route::middleware('permission:applications.create')->group(function () {
        Route::post('employment-history/{employmentHistory}/reference-checks', [ReferenceCheckController::class, 'store'])->name('employment-history.reference-checks.store');
        Route::post('job-applications/{application}/background-checks', [BackgroundCheckController::class, 'store'])->name('job-applications.background-checks.store');
        Route::post('job-applications/{application}/offers', [OfferController::class, 'store'])->name('job-applications.offers.store');
    });

    Route::middleware('permission:interviews.view')->group(function () {
        Route::get('interviews', [InterviewController::class, 'index'])->name('interviews.index');
        Route::get('interviews/{interview}', [InterviewController::class, 'show'])->name('interviews.show');
    });
    Route::put('interviews/{interview}', [InterviewController::class, 'update'])->name('interviews.update')->middleware('permission:interviews.update');
    Route::post('job-applications/{application}/interviews', [InterviewController::class, 'store'])->name('job-applications.interviews.store')->middleware('permission:interviews.create');

    Route::resource('interview-questions', InterviewQuestionController::class)->except(['show'])
        ->middlewareFor(['index'], 'permission:interview-questions.view')
        ->middlewareFor(['create', 'store'], 'permission:interview-questions.create')
        ->middlewareFor(['edit', 'update'], 'permission:interview-questions.update')
        ->middlewareFor(['destroy'], 'permission:interview-questions.delete');

    Route::resource('assessments', AssessmentController::class)->except(['show'])
        ->middlewareFor(['index'], 'permission:assessments.view')
        ->middlewareFor(['create', 'store'], 'permission:assessments.create')
        ->middlewareFor(['edit', 'update'], 'permission:assessments.update')
        ->middlewareFor(['destroy'], 'permission:assessments.delete');
    Route::resource('assessments.questions', AssessmentQuestionController::class)->except(['show'])->shallow()
        ->middlewareFor(['index'], 'permission:assessments.view')
        ->middlewareFor(['create', 'store'], 'permission:assessments.create')
        ->middlewareFor(['edit', 'update'], 'permission:assessments.update')
        ->middlewareFor(['destroy'], 'permission:assessments.delete');

    Route::middleware('permission:assessment-attempts.view')->group(function () {
        Route::get('assessment-attempts', [AssessmentAttemptController::class, 'index'])->name('assessment-attempts.index');
        Route::get('assessment-attempts/{assessmentAttempt}', [AssessmentAttemptController::class, 'show'])->name('assessment-attempts.show');
    });
    Route::put('assessment-attempts/{assessmentAttempt}', [AssessmentAttemptController::class, 'update'])->name('assessment-attempts.update')->middleware('permission:assessment-attempts.update');
    Route::post('job-applications/{application}/assessment-attempts', [AssessmentAttemptController::class, 'store'])->name('job-applications.assessment-attempts.store')->middleware('permission:assessment-attempts.create');

    Route::resource('communication-templates', CommunicationTemplateController::class)->except(['show'])
        ->middlewareFor(['index'], 'permission:communication-templates.view')
        ->middlewareFor(['create', 'store'], 'permission:communication-templates.create')
        ->middlewareFor(['edit', 'update'], 'permission:communication-templates.update')
        ->middlewareFor(['destroy'], 'permission:communication-templates.delete');

    Route::resource('onboarding-checklist-templates', OnboardingChecklistTemplateController::class)->except(['show'])
        ->middlewareFor(['index'], 'permission:onboarding.view')
        ->middlewareFor(['create', 'store'], 'permission:onboarding.create')
        ->middlewareFor(['edit', 'update'], 'permission:onboarding.update')
        ->middlewareFor(['destroy'], 'permission:onboarding.delete');
    Route::resource('onboarding-checklist-templates.items', OnboardingChecklistTemplateItemController::class)->except(['show'])->shallow()
        ->middlewareFor(['index'], 'permission:onboarding.view')
        ->middlewareFor(['create', 'store'], 'permission:onboarding.create')
        ->middlewareFor(['edit', 'update'], 'permission:onboarding.update')
        ->middlewareFor(['destroy'], 'permission:onboarding.delete');

    // Employees are only ever created automatically by the hiring pipeline
    // (an application being approved) — there's no admin create/edit/delete
    // route for one, so this is view-only.
    Route::middleware('permission:employees.view')->group(function () {
        Route::get('employees', [EmployeeController::class, 'index'])->name('employees.index');
        Route::get('employees/{employee}', [EmployeeController::class, 'show'])->name('employees.show');
    });

    // Credential-expiry monitoring — view-only; the verify/reject actions
    // that act on a credential live under applications.update since
    // they're invoked from a candidate's dossier, not from this page.
    Route::get('compliance', [ComplianceController::class, 'index'])->name('compliance.index')->middleware('permission:compliance.view');

    Route::resource('facilities', FacilityController::class)->except(['show'])
        ->middlewareFor(['index'], 'permission:facilities.view')
        ->middlewareFor(['create', 'store'], 'permission:facilities.create')
        ->middlewareFor(['edit', 'update'], 'permission:facilities.update')
        ->middlewareFor(['destroy'], 'permission:facilities.delete');
    Route::resource('facilities.shifts', ShiftController::class)->shallow()
        ->middlewareFor(['index', 'show'], 'permission:facilities.view')
        ->middlewareFor(['create', 'store'], 'permission:facilities.create')
        ->middlewareFor(['edit', 'update'], 'permission:facilities.update')
        ->middlewareFor(['destroy'], 'permission:facilities.delete');
    Route::post('shifts/{shift}/assignments', [ShiftAssignmentController::class, 'store'])->name('shifts.assignments.store')->middleware('permission:facilities.create');
    Route::put('shift-assignments/{shiftAssignment}', [ShiftAssignmentController::class, 'update'])->name('shift-assignments.update')->middleware('permission:facilities.update');

    Route::resource('policy-documents', PolicyDocumentController::class)->except(['show'])
        ->middlewareFor(['index'], 'permission:policy-documents.view')
        ->middlewareFor(['create', 'store'], 'permission:policy-documents.create')
        ->middlewareFor(['edit', 'update'], 'permission:policy-documents.update')
        ->middlewareFor(['destroy'], 'permission:policy-documents.delete');

    Route::get('copilot', [CopilotController::class, 'index'])->name('copilot.index');
    Route::post('copilot/message', [CopilotController::class, 'message'])->name('copilot.message');
    Route::post('copilot/actions/{copilotAction}/confirm', [CopilotController::class, 'confirmAction'])->name('copilot.actions.confirm');
    Route::post('copilot/actions/{copilotAction}/reject', [CopilotController::class, 'rejectAction'])->name('copilot.actions.reject');

    Route::resource('blog-posts', BlogPostController::class)->except(['show'])
        ->middlewareFor(['index'], 'permission:blog-posts.view')
        ->middlewareFor(['create', 'store'], 'permission:blog-posts.create')
        ->middlewareFor(['edit', 'update'], 'permission:blog-posts.update')
        ->middlewareFor(['destroy'], 'permission:blog-posts.delete');

    Route::resource('testimonials', TestimonialController::class)->except(['show'])
        ->middlewareFor(['index'], 'permission:testimonials.view')
        ->middlewareFor(['create', 'store'], 'permission:testimonials.create')
        ->middlewareFor(['edit', 'update'], 'permission:testimonials.update')
        ->middlewareFor(['destroy'], 'permission:testimonials.delete');

    Route::resource('stats', StatController::class)->except(['show'])
        ->middlewareFor(['index'], 'permission:stats.view')
        ->middlewareFor(['create', 'store'], 'permission:stats.create')
        ->middlewareFor(['edit', 'update'], 'permission:stats.update')
        ->middlewareFor(['destroy'], 'permission:stats.delete');

    // Leads arrive only through the public staffing-request form — no
    // admin create/delete route exists for one.
    Route::resource('staffing-requests', StaffingRequestController::class)->only(['index', 'show', 'update'])
        ->middlewareFor(['index', 'show'], 'permission:staffing-requests.view')
        ->middlewareFor(['update'], 'permission:staffing-requests.update');

    Route::resource('users', UserController::class)->except(['show'])
        ->middlewareFor(['index'], 'permission:users.view')
        ->middlewareFor(['create', 'store'], 'permission:users.create')
        ->middlewareFor(['edit', 'update'], 'permission:users.update')
        ->middlewareFor(['destroy'], 'permission:users.delete');
    Route::middleware('permission:users.update')->group(function () {
        Route::post('users/{user}/generate-password', [UserController::class, 'generatePassword'])->name('users.generate-password');
        Route::put('users/{user}/password', [UserController::class, 'setPassword'])->name('users.set-password');
        Route::post('users/{user}/send-reset-link', [UserController::class, 'sendResetLink'])->name('users.send-reset-link');
    });

    Route::resource('roles', RoleController::class)->except(['show'])
        ->middlewareFor(['index'], 'permission:roles.view')
        ->middlewareFor(['create', 'store'], 'permission:roles.create')
        ->middlewareFor(['edit', 'update'], 'permission:roles.update')
        ->middlewareFor(['destroy'], 'permission:roles.delete');
});
