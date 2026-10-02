<?php

use App\Models\Application;
use App\Models\Candidate;
use App\Models\Credential;
use App\Models\EmploymentHistory;
use App\Models\ReferenceCheck;
use App\Models\User;
use Database\Seeders\RoleSeeder;

beforeEach(function () {
    $this->seed(RoleSeeder::class);
    $this->admin = User::factory()->create();
    $this->admin->assignRole('admin');
});

test('verifying a credential passes the matching requirement on every open application', function () {
    $candidate = Candidate::factory()->create();
    $credential = Credential::query()->create([
        'candidate_id' => $candidate->id,
        'credential_type' => 'license',
        'credential_name' => 'RN License',
    ]);

    $openApplication = Application::factory()->create(['candidate_id' => $candidate->id]);
    $requirement = $openApplication->requirements()->create(['requirement_type' => 'license_verification']);

    $resolvedApplication = Application::factory()->create(['candidate_id' => $candidate->id]);
    $resolvedRequirement = $resolvedApplication->requirements()->create(['requirement_type' => 'license_verification']);
    $resolvedRequirement->markComplete();

    $response = $this->actingAs($this->admin)->put(route('admin.credentials.verify', $credential));

    $response->assertRedirect(route('admin.candidates.show', $candidate->id));

    $credential->refresh();
    expect($credential->verification_status)->toBe('verified');
    expect($credential->verified_by)->toBe($this->admin->id);

    $requirement->refresh();
    expect($requirement->status)->toBe('passed');
    expect($requirement->related_credential_id)->toBe($credential->id);

    // The already-resolved application's requirement is left untouched (no double markComplete timestamp churn).
    $resolvedRequirement->refresh();
    expect($resolvedRequirement->related_credential_id)->toBeNull();
});

test('rejecting a credential fails the matching requirement and saves notes', function () {
    $candidate = Candidate::factory()->create();
    $credential = Credential::query()->create([
        'candidate_id' => $candidate->id,
        'credential_type' => 'certification',
        'credential_name' => 'CPR Certification',
    ]);
    $application = Application::factory()->create(['candidate_id' => $candidate->id]);
    $requirement = $application->requirements()->create(['requirement_type' => 'certification_verification']);

    $this->actingAs($this->admin)->put(route('admin.credentials.reject', $credential), [
        'notes' => 'Expired certification.',
    ]);

    $credential->refresh();
    expect($credential->verification_status)->toBe('rejected');
    expect($credential->notes)->toBe('Expired certification.');

    $requirement->refresh();
    expect($requirement->status)->toBe('failed');
    expect($requirement->related_credential_id)->toBe($credential->id);
});

test('an admin can log a reference check against an employment history entry', function () {
    $candidate = Candidate::factory()->create();
    $employmentHistory = EmploymentHistory::query()->create([
        'candidate_id' => $candidate->id,
        'employer_name' => 'Memorial Hospital',
        'job_title' => 'RN',
        'start_date' => '2020-01-01',
        'supervisor_name' => 'J. Lee',
        'supervisor_contact' => '555-0100',
    ]);

    $response = $this->actingAs($this->admin)->post(route('admin.employment-history.reference-checks.store', $employmentHistory), [
        'contact_method' => 'phone',
        'contacted_at' => now()->toDateTimeString(),
        'outcome' => 'positive',
        'notes' => 'Reliable, would rehire.',
    ]);

    $response->assertRedirect(route('admin.candidates.show', $candidate->id));

    $check = ReferenceCheck::query()->where('employment_history_id', $employmentHistory->id)->firstOrFail();
    expect($check->outcome)->toBe('positive');
    expect($check->checked_by)->toBe($this->admin->id);
});

test('an admin can manually resolve a requirement with no other automation', function () {
    $application = Application::factory()->create();
    $requirement = $application->requirements()->create(['requirement_type' => 'employment_history_verification']);

    $this->actingAs($this->admin)->put(route('admin.application-requirements.update', $requirement), [
        'status' => 'passed',
    ]);

    expect($requirement->refresh()->status)->toBe('passed');
});

test('an editor cannot verify credentials or resolve requirements', function () {
    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $candidate = Candidate::factory()->create();
    $credential = Credential::query()->create([
        'candidate_id' => $candidate->id,
        'credential_type' => 'license',
        'credential_name' => 'RN License',
    ]);
    $application = Application::factory()->create(['candidate_id' => $candidate->id]);
    $requirement = $application->requirements()->create(['requirement_type' => 'license_verification']);

    $this->actingAs($editor)->put(route('admin.credentials.verify', $credential))->assertForbidden();
    $this->actingAs($editor)->put(route('admin.application-requirements.update', $requirement), ['status' => 'passed'])->assertForbidden();
});
