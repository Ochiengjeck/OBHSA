<?php

use App\Models\Application;
use App\Models\BackgroundCheck;
use App\Models\Candidate;
use App\Models\User;
use Database\Seeders\RoleSeeder;

beforeEach(function () {
    $this->seed(RoleSeeder::class);
    $this->admin = User::factory()->create();
    $this->admin->assignRole('admin');
});

test('an admin can initiate a background check', function () {
    $application = Application::factory()->create();

    $response = $this->actingAs($this->admin)->post(route('admin.job-applications.background-checks.store', $application), [
        'provider' => 'Checkr',
    ]);

    $response->assertRedirect(route('admin.candidates.show', $application->candidate_id));

    $check = BackgroundCheck::query()->where('application_id', $application->id)->firstOrFail();
    expect($check->provider)->toBe('Checkr');
    expect($check->status)->toBe('initiated');
    expect($check->initiated_by)->toBe($this->admin->id);
});

test('recording a clear result passes the background check requirement', function () {
    $application = Application::factory()->create();
    $requirement = $application->requirements()->create(['requirement_type' => 'background_check']);
    $check = $application->backgroundChecks()->create([
        'provider' => 'Checkr',
        'initiated_at' => now(),
        'initiated_by' => $this->admin->id,
    ]);

    $this->actingAs($this->admin)->put(route('admin.background-checks.update', $check), [
        'status' => 'clear',
        'notes' => 'No findings.',
    ]);

    $check->refresh();
    expect($check->status)->toBe('clear');
    expect($check->notes)->toBe('No findings.');
    expect($check->resolved_by)->toBe($this->admin->id);
    expect($check->result_received_at)->not->toBeNull();

    expect($requirement->refresh()->status)->toBe('passed');
});

test('recording a flagged result fails the background check requirement', function () {
    $application = Application::factory()->create();
    $requirement = $application->requirements()->create(['requirement_type' => 'background_check']);
    $check = $application->backgroundChecks()->create([
        'provider' => 'Checkr',
        'initiated_at' => now(),
        'initiated_by' => $this->admin->id,
    ]);

    $this->actingAs($this->admin)->put(route('admin.background-checks.update', $check), [
        'status' => 'flagged',
    ]);

    expect($requirement->refresh()->status)->toBe('failed');
});

test('resolving a background check leaves an already-decided application untouched', function () {
    $candidate = Candidate::factory()->create();

    $resolvedApplication = Application::factory()->create(['candidate_id' => $candidate->id]);
    $resolvedRequirement = $resolvedApplication->requirements()->create(['requirement_type' => 'background_check']);
    $resolvedRequirement->markComplete();

    $openApplication = Application::factory()->create(['candidate_id' => $candidate->id]);
    $openApplication->requirements()->create(['requirement_type' => 'background_check']);
    $check = $openApplication->backgroundChecks()->create([
        'provider' => 'Checkr',
        'initiated_at' => now(),
        'initiated_by' => $this->admin->id,
    ]);

    $this->actingAs($this->admin)->put(route('admin.background-checks.update', $check), [
        'status' => 'clear',
    ]);

    // The already-resolved application's requirement keeps its original completed_at (untouched).
    $resolvedRequirement->refresh();
    expect($resolvedRequirement->status)->toBe('passed');
});

test('an editor cannot initiate or resolve background checks', function () {
    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $application = Application::factory()->create();
    $check = $application->backgroundChecks()->create([
        'provider' => 'Checkr',
        'initiated_at' => now(),
    ]);

    $this->actingAs($editor)->post(route('admin.job-applications.background-checks.store', $application), [
        'provider' => 'Checkr',
    ])->assertForbidden();

    $this->actingAs($editor)->put(route('admin.background-checks.update', $check), [
        'status' => 'clear',
    ])->assertForbidden();
});
