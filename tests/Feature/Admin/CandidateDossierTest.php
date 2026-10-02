<?php

use App\Enums\ApplicationStatus;
use App\Mail\CandidateMessage;
use App\Models\Application;
use App\Models\ApplicationCommunication;
use App\Models\ApplicationStageHistory;
use App\Models\CommunicationTemplate;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Support\Facades\Mail;

beforeEach(function () {
    $this->seed(RoleSeeder::class);
    $this->admin = User::factory()->create();
    $this->admin->assignRole('admin');
});

test('an admin can view a candidate dossier', function () {
    $application = Application::factory()->create();

    $response = $this->actingAs($this->admin)->get(route('admin.candidates.show', $application->candidate_id));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('admin/candidates/show'));
});

test('an admin can assign a recruiter to an application', function () {
    $application = Application::factory()->create();
    $recruiter = User::factory()->create();

    $response = $this->actingAs($this->admin)->put(route('admin.job-applications.recruiter', $application), [
        'assigned_recruiter_id' => $recruiter->id,
    ]);

    $response->assertRedirect(route('admin.candidates.show', $application->candidate_id));

    expect($application->refresh()->assigned_recruiter_id)->toBe($recruiter->id);
});

test('an admin can unassign a recruiter', function () {
    $recruiter = User::factory()->create();
    $application = Application::factory()->create(['assigned_recruiter_id' => $recruiter->id]);

    $this->actingAs($this->admin)->put(route('admin.job-applications.recruiter', $application), [
        'assigned_recruiter_id' => null,
    ]);

    expect($application->refresh()->assigned_recruiter_id)->toBeNull();
});

test('an admin can send a templated message to a candidate and it is logged', function () {
    Mail::fake();

    $application = Application::factory()->create();
    $template = CommunicationTemplate::query()->create([
        'name' => 'Request More Info',
        'subject' => 'Need a bit more info',
        'body' => 'Hi {{candidate_name}}, following up on {{position}}.',
    ]);

    $response = $this->actingAs($this->admin)->post(route('admin.job-applications.message', $application), [
        'communication_template_id' => $template->id,
        'subject' => 'Need a bit more info',
        'body' => 'Hi Jane, following up on your application.',
    ]);

    $response->assertRedirect(route('admin.candidates.show', $application->candidate_id));

    $communication = ApplicationCommunication::query()->where('application_id', $application->id)->firstOrFail();
    expect($communication->subject)->toBe('Need a bit more info');
    expect($communication->communication_template_id)->toBe($template->id);
    expect($communication->sent_by)->toBe($this->admin->id);

    Mail::assertQueued(CandidateMessage::class, fn (CandidateMessage $mail) => $mail->application->is($application));
});

test('a structured reason code is recorded when an admin changes application status', function () {
    $application = Application::factory()->submitted()->create();

    $this->actingAs($this->admin)->put(route('admin.job-applications.update', $application), [
        'status' => 'rejected',
        'reason_code' => 'not_a_fit',
    ]);

    $entry = ApplicationStageHistory::query()->where('application_id', $application->id)->orderByDesc('id')->first();
    expect($entry->to_status)->toBe('rejected');
    expect($entry->reason_code)->toBe('not_a_fit');
});

test('the applications index exposes every application status as a filter option', function () {
    $response = $this->actingAs($this->admin)->get(route('admin.job-applications.index'));

    $response->assertOk();

    $props = $response->viewData('page')['props'];
    $values = array_column($props['statusOptions'], 'value');

    expect($values)->toContain('screening', 'credentialing', 'ineligible', 'expired');
    expect($values)->toHaveCount(count(ApplicationStatus::cases()));
});
