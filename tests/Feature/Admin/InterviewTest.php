<?php

use App\Models\Application;
use App\Models\Interview;
use App\Models\InterviewQuestion;
use App\Models\User;
use Database\Seeders\RoleSeeder;

beforeEach(function () {
    $this->seed(RoleSeeder::class);
    $this->admin = User::factory()->create();
    $this->admin->assignRole('admin');
});

test('scheduling an interview snapshots only questions matching the candidate specialty', function () {
    $application = Application::factory()->create(['primary_specialty' => 'rn']);
    $interviewer = User::factory()->create();

    InterviewQuestion::query()->create(['question' => 'General question', 'specialty' => null, 'is_active' => true, 'position' => 0]);
    InterviewQuestion::query()->create(['question' => 'RN question', 'specialty' => 'rn', 'is_active' => true, 'position' => 1]);
    InterviewQuestion::query()->create(['question' => 'CNA question', 'specialty' => 'cna', 'is_active' => true, 'position' => 2]);
    InterviewQuestion::query()->create(['question' => 'Inactive question', 'specialty' => null, 'is_active' => false, 'position' => 3]);

    $response = $this->actingAs($this->admin)->post(route('admin.job-applications.interviews.store', $application), [
        'scheduled_at' => now()->addDay()->toDateTimeString(),
        'interviewer_id' => $interviewer->id,
        'format' => 'video',
        'location_or_link' => 'https://example.com/meet',
    ]);

    $response->assertRedirect(route('admin.candidates.show', $application->candidate_id));

    $interview = Interview::query()->where('application_id', $application->id)->firstOrFail();
    expect($interview->interviewer_id)->toBe($interviewer->id);
    expect($interview->status)->toBe('scheduled');

    $questionTexts = $interview->responses()->pluck('question_text')->all();
    expect($questionTexts)->toContain('General question', 'RN question');
    expect($questionTexts)->not->toContain('CNA question', 'Inactive question');
});

test('an admin can score and complete an interview', function () {
    $application = Application::factory()->create();
    $interview = Interview::forceCreate([
        'application_id' => $application->id,
        'scheduled_at' => now(),
        'format' => 'phone',
        'status' => 'scheduled',
        'created_by' => $this->admin->id,
    ]);
    $response1 = $interview->responses()->create(['question_text' => 'Q1', 'position' => 0]);
    $response2 = $interview->responses()->create(['question_text' => 'Q2', 'position' => 1]);

    $result = $this->actingAs($this->admin)->put(route('admin.interviews.update', $interview), [
        'scheduled_at' => $interview->scheduled_at->toDateTimeString(),
        'interviewer_id' => null,
        'format' => 'phone',
        'location_or_link' => null,
        'status' => 'completed',
        'recommendation' => 'recommend',
        'overall_notes' => 'Strong candidate.',
        'responses' => [
            ['id' => $response1->id, 'score' => 5, 'notes' => 'Great answer'],
            ['id' => $response2->id, 'score' => 4, 'notes' => null],
        ],
    ]);

    $result->assertRedirect(route('admin.interviews.show', $interview));

    $interview->refresh();
    expect($interview->status)->toBe('completed');
    expect($interview->recommendation)->toBe('recommend');
    expect($interview->completed_at)->not->toBeNull();
    expect($interview->responses()->find($response1->id)->score)->toBe(5);
    expect($interview->responses()->find($response2->id)->score)->toBe(4);
});

test('the interviews index filters by interviewer and status', function () {
    $interviewerOne = User::factory()->create();
    $interviewerTwo = User::factory()->create();

    $matching = Interview::forceCreate([
        'application_id' => Application::factory()->create()->id,
        'interviewer_id' => $interviewerOne->id,
        'scheduled_at' => now(),
        'format' => 'phone',
        'status' => 'scheduled',
    ]);

    Interview::forceCreate([
        'application_id' => Application::factory()->create()->id,
        'interviewer_id' => $interviewerTwo->id,
        'scheduled_at' => now(),
        'format' => 'phone',
        'status' => 'completed',
    ]);

    $response = $this->actingAs($this->admin)->get(route('admin.interviews.index', [
        'interviewer_id' => $interviewerOne->id,
        'status' => 'scheduled',
    ]));

    $response->assertOk();

    $props = $response->viewData('page')['props'];
    $ids = array_column($props['interviews']['data'], 'id');

    expect($ids)->toBe([$matching->id]);
});

test('an editor cannot manage interviews or the question bank', function () {
    $editor = User::factory()->create();
    $editor->assignRole('editor');
    $application = Application::factory()->create();

    $this->actingAs($editor)->get(route('admin.interviews.index'))->assertForbidden();
    $this->actingAs($editor)->get(route('admin.interview-questions.index'))->assertForbidden();
    $this->actingAs($editor)->post(route('admin.job-applications.interviews.store', $application), [
        'scheduled_at' => now()->addDay()->toDateTimeString(),
        'format' => 'phone',
    ])->assertForbidden();
});
