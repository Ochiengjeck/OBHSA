<?php

use App\Mail\AssessmentInvitation;
use App\Models\Application;
use App\Models\Assessment;
use App\Models\AssessmentAttempt;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Support\Facades\Mail;

beforeEach(function () {
    $this->seed(RoleSeeder::class);
    $this->admin = User::factory()->create();
    $this->admin->assignRole('admin');
});

function createAssessmentWithQuestions(string $deliveryMode, int $maxAttempts = 1): Assessment
{
    $assessment = Assessment::query()->create([
        'name' => 'RN Clinical Skills Test',
        'delivery_mode' => $deliveryMode,
        'passing_score' => 70,
        'max_attempts' => $maxAttempts,
        'is_active' => true,
    ]);

    $assessment->questions()->create([
        'question' => 'What is 2 + 2?',
        'question_type' => 'multiple_choice',
        'options' => ['3', '4', '5'],
        'correct_option' => '4',
        'points' => 1,
        'position' => 0,
    ]);

    return $assessment;
}

test('assigning a self-service assessment emails an invitation and snapshots questions', function () {
    Mail::fake();

    $assessment = createAssessmentWithQuestions('self_service');
    $application = Application::factory()->create();

    $response = $this->actingAs($this->admin)->post(route('admin.job-applications.assessment-attempts.store', $application), [
        'assessment_id' => $assessment->id,
    ]);

    $response->assertRedirect(route('admin.candidates.show', $application->candidate_id));

    $attempt = AssessmentAttempt::query()->where('application_id', $application->id)->firstOrFail();
    expect($attempt->status)->toBe('pending');
    expect($attempt->attempt_number)->toBe(1);
    expect($attempt->access_token)->not->toBeNull();
    expect($attempt->responses()->count())->toBe(1);

    Mail::assertQueued(AssessmentInvitation::class, fn (AssessmentInvitation $mail) => $mail->attempt->is($attempt));
});

test('assigning a staff-administered assessment redirects to the entry screen', function () {
    $assessment = createAssessmentWithQuestions('staff_administered');
    $application = Application::factory()->create();

    $response = $this->actingAs($this->admin)->post(route('admin.job-applications.assessment-attempts.store', $application), [
        'assessment_id' => $assessment->id,
    ]);

    $attempt = AssessmentAttempt::query()->where('application_id', $application->id)->firstOrFail();

    $response->assertRedirect(route('admin.assessment-attempts.show', $attempt));
    expect($attempt->access_token)->toBeNull();
});

test('a second attempt is blocked once max_attempts is reached', function () {
    $assessment = createAssessmentWithQuestions('staff_administered', maxAttempts: 1);
    $application = Application::factory()->create();

    $this->actingAs($this->admin)->post(route('admin.job-applications.assessment-attempts.store', $application), [
        'assessment_id' => $assessment->id,
    ]);

    $this->actingAs($this->admin)->post(route('admin.job-applications.assessment-attempts.store', $application), [
        'assessment_id' => $assessment->id,
    ])->assertStatus(422);

    expect(AssessmentAttempt::query()->where('application_id', $application->id)->count())->toBe(1);
});

test('staff can fill in and grade a staff-administered attempt', function () {
    $assessment = createAssessmentWithQuestions('staff_administered');
    $assessment->questions()->create([
        'question' => 'Describe proper handwashing technique.',
        'question_type' => 'short_answer',
        'points' => 1,
        'position' => 1,
    ]);

    $application = Application::factory()->create();

    $this->actingAs($this->admin)->post(route('admin.job-applications.assessment-attempts.store', $application), [
        'assessment_id' => $assessment->id,
    ]);

    $attempt = AssessmentAttempt::query()->where('application_id', $application->id)->firstOrFail();
    $responses = $attempt->responses()->orderBy('position')->get();

    $response = $this->actingAs($this->admin)->put(route('admin.assessment-attempts.update', $attempt), [
        'status' => 'completed',
        'responses' => [
            ['id' => $responses[0]->id, 'selected_option' => '4'],
            ['id' => $responses[1]->id, 'answer_text' => 'Soap and water for 20 seconds.', 'points_awarded' => 1],
        ],
    ]);

    $response->assertRedirect(route('admin.candidates.show', $application->candidate_id));

    $attempt->refresh();
    expect($attempt->status)->toBe('completed');
    expect($attempt->score)->toBe(100);
    expect($attempt->passed)->toBeTrue();
    expect($attempt->administered_by)->toBe($this->admin->id);
});

test('an editor cannot assign or grade assessments', function () {
    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $assessment = createAssessmentWithQuestions('staff_administered');
    $application = Application::factory()->create();

    $this->actingAs($editor)->post(route('admin.job-applications.assessment-attempts.store', $application), [
        'assessment_id' => $assessment->id,
    ])->assertForbidden();

    $this->actingAs($editor)->get(route('admin.assessments.index'))->assertForbidden();
});
