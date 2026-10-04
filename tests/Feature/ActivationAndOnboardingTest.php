<?php

use App\Enums\ApplicationStatus;
use App\Models\Application;
use App\Models\Employee;
use App\Models\Offer;
use App\Models\OnboardingChecklistTemplate;
use App\Models\User;
use Database\Seeders\RoleSeeder;

beforeEach(function () {
    $this->seed(RoleSeeder::class);
    $this->admin = User::factory()->create();
    $this->admin->assignRole('admin');
});

function advanceToOfferAccepted(Application $application): void
{
    foreach ([
        ApplicationStatus::Submitted,
        ApplicationStatus::EligibilityReview,
        ApplicationStatus::RecruiterReview,
        ApplicationStatus::Screening,
        ApplicationStatus::Credentialing,
        ApplicationStatus::Interview,
        ApplicationStatus::Assessment,
        ApplicationStatus::FinalReview,
        ApplicationStatus::Approved,
        ApplicationStatus::OfferPending,
        ApplicationStatus::OfferAccepted,
    ] as $status) {
        $application->transitionTo($status, actor: null, reasonCode: 'test');
    }
}

test('transitioning to onboarding instantiates the default checklist template as requirements', function () {
    $template = OnboardingChecklistTemplate::query()->create([
        'name' => 'Standard Onboarding',
        'is_default' => true,
        'is_active' => true,
    ]);
    $template->items()->create(['task_key' => 'i9_verification', 'label' => 'I-9 Verification', 'is_blocking' => true, 'position' => 0]);
    $template->items()->create(['task_key' => 'handbook_ack', 'label' => 'Handbook Acknowledgement', 'is_blocking' => false, 'position' => 1]);

    $application = Application::factory()->create();
    advanceToOfferAccepted($application);

    $this->actingAs($this->admin)->put(route('admin.job-applications.update', $application), [
        'status' => 'onboarding',
    ]);

    $application->refresh();
    expect($application->status)->toBe('onboarding');

    $requirement = $application->requirements()->where('requirement_type', 'onboarding:i9_verification')->firstOrFail();
    expect($requirement->is_blocking)->toBeTrue();

    $optional = $application->requirements()->where('requirement_type', 'onboarding:handbook_ack')->firstOrFail();
    expect($optional->is_blocking)->toBeFalse();
});

test('re-entering onboarding does not duplicate checklist requirements', function () {
    $template = OnboardingChecklistTemplate::query()->create([
        'name' => 'Standard Onboarding',
        'is_default' => true,
        'is_active' => true,
    ]);
    $template->items()->create(['task_key' => 'i9_verification', 'label' => 'I-9 Verification', 'is_blocking' => true, 'position' => 0]);

    $application = Application::factory()->create();
    advanceToOfferAccepted($application);

    $this->actingAs($this->admin)->put(route('admin.job-applications.update', $application), ['status' => 'onboarding']);
    $this->actingAs($this->admin)->put(route('admin.job-applications.update', $application), ['status' => 'on_hold']);
    $this->actingAs($this->admin)->put(route('admin.job-applications.update', $application), ['status' => 'onboarding']);

    expect($application->requirements()->where('requirement_type', 'onboarding:i9_verification')->count())->toBe(1);
});

test('activating an application is blocked until blocking requirements pass', function () {
    $template = OnboardingChecklistTemplate::query()->create([
        'name' => 'Standard Onboarding',
        'is_default' => true,
        'is_active' => true,
    ]);
    $template->items()->create(['task_key' => 'i9_verification', 'label' => 'I-9 Verification', 'is_blocking' => true, 'position' => 0]);

    $application = Application::factory()->create();
    advanceToOfferAccepted($application);

    $this->actingAs($this->admin)->put(route('admin.job-applications.update', $application), ['status' => 'onboarding']);
    $this->actingAs($this->admin)->put(route('admin.job-applications.update', $application), ['status' => 'activation_review']);

    $this->actingAs($this->admin)->put(route('admin.job-applications.update', $application), ['status' => 'active']);

    expect($application->fresh()->status)->toBe('activation_review');
    expect(Employee::query()->where('candidate_id', $application->candidate_id)->exists())->toBeFalse();
});

test('activating an application succeeds once blocking requirements pass and creates an employee', function () {
    $template = OnboardingChecklistTemplate::query()->create([
        'name' => 'Standard Onboarding',
        'is_default' => true,
        'is_active' => true,
    ]);
    $template->items()->create(['task_key' => 'i9_verification', 'label' => 'I-9 Verification', 'is_blocking' => true, 'position' => 0]);

    $application = Application::factory()->create(['primary_specialty' => 'rn']);
    advanceToOfferAccepted($application);

    $offer = Offer::query()->create([
        'application_id' => $application->id,
        'position' => 'RN - ICU',
        'pay_rate' => 55.00,
        'employment_type' => 'full_time',
        'start_date' => now(),
    ]);
    $offer->accept();

    $this->actingAs($this->admin)->put(route('admin.job-applications.update', $application), ['status' => 'onboarding']);
    $this->actingAs($this->admin)->put(route('admin.job-applications.update', $application), ['status' => 'activation_review']);

    $requirement = $application->requirements()->where('requirement_type', 'onboarding:i9_verification')->firstOrFail();
    $requirement->markComplete();

    $this->actingAs($this->admin)->put(route('admin.job-applications.update', $application), ['status' => 'active']);

    $application->refresh();
    expect($application->status)->toBe('active');

    $employee = Employee::query()->where('candidate_id', $application->candidate_id)->firstOrFail();
    expect($employee->employee_number)->toBe('EMP-'.str_pad((string) $employee->id, 5, '0', STR_PAD_LEFT));
    expect((float) $employee->pay_rate)->toBe(55.0);
    expect($employee->specialty)->toBe('rn');
});

test('a user without applications.update cannot change an application status', function () {
    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $application = Application::factory()->create();

    $this->actingAs($editor)->put(route('admin.job-applications.update', $application), [
        'status' => 'submitted',
    ])->assertForbidden();
});
