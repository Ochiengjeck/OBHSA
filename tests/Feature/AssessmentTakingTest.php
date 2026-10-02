<?php

use App\Mail\AssessmentInvitation;
use App\Models\Application;
use App\Models\Assessment;
use App\Models\AssessmentAttempt;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

function assignSelfServiceAttempt(TestCase $test, Assessment $assessment, Application $application, User $admin): string
{
    $plaintext = null;

    Mail::fake();

    $test->actingAs($admin)->post(route('admin.job-applications.assessment-attempts.store', $application), [
        'assessment_id' => $assessment->id,
    ]);

    Mail::assertQueued(AssessmentInvitation::class, function (AssessmentInvitation $mail) use (&$plaintext) {
        $plaintext = $mail->plaintextToken;

        return true;
    });

    return $plaintext;
}

beforeEach(function () {
    $this->seed(RoleSeeder::class);
    $this->admin = User::factory()->create();
    $this->admin->assignRole('admin');
});

test('submitting a multiple-choice-only assessment is auto-graded and completed immediately', function () {
    $assessment = Assessment::query()->create([
        'name' => 'Quick Quiz',
        'delivery_mode' => 'self_service',
        'passing_score' => 70,
        'max_attempts' => 1,
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

    $application = Application::factory()->create();
    $token = assignSelfServiceAttempt($this, $assessment, $application, $this->admin);

    $this->get(route('assessments.show', $token))->assertOk();

    $attempt = AssessmentAttempt::query()->where('application_id', $application->id)->firstOrFail();
    $responseId = $attempt->responses()->first()->id;

    $response = $this->post(route('assessments.submit', $token), [
        'responses' => [
            ['id' => $responseId, 'selected_option' => '4'],
        ],
    ]);

    $response->assertRedirect(route('assessments.thank-you'));

    $attempt->refresh();
    expect($attempt->status)->toBe('completed');
    expect($attempt->score)->toBe(100);
    expect($attempt->passed)->toBeTrue();
});

test('a mixed assessment with a short-answer question awaits grading, then completes once graded', function () {
    $assessment = Assessment::query()->create([
        'name' => 'Mixed Assessment',
        'delivery_mode' => 'self_service',
        'passing_score' => 50,
        'max_attempts' => 1,
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
    $assessment->questions()->create([
        'question' => 'Describe proper handwashing technique.',
        'question_type' => 'short_answer',
        'points' => 1,
        'position' => 1,
    ]);

    $application = Application::factory()->create();
    $token = assignSelfServiceAttempt($this, $assessment, $application, $this->admin);

    $attempt = AssessmentAttempt::query()->where('application_id', $application->id)->firstOrFail();
    $responses = $attempt->responses()->orderBy('position')->get();

    $this->post(route('assessments.submit', $token), [
        'responses' => [
            ['id' => $responses[0]->id, 'selected_option' => '4'],
            ['id' => $responses[1]->id, 'answer_text' => 'Soap and water.'],
        ],
    ]);

    $attempt->refresh();
    expect($attempt->status)->toBe('submitted');
    expect($attempt->score)->toBeNull();

    $this->actingAs($this->admin)->put(route('admin.assessment-attempts.update', $attempt), [
        'status' => 'completed',
        'responses' => [
            ['id' => $responses[1]->id, 'points_awarded' => 1],
        ],
    ]);

    $attempt->refresh();
    expect($attempt->status)->toBe('completed');
    expect($attempt->score)->toBe(100);
    expect($attempt->passed)->toBeTrue();
});

test('an invalid assessment token shows a generic invalid-link page', function () {
    $this->get(route('assessments.show', 'does-not-exist'))
        ->assertInertia(fn ($page) => $page
            ->component('public/assessments/link-issue')
            ->where('reason', 'invalid'));
});

test('an expired assessment token shows the link-expired page', function () {
    $assessment = Assessment::query()->create([
        'name' => 'Expired Test',
        'delivery_mode' => 'self_service',
        'passing_score' => 70,
        'max_attempts' => 1,
        'is_active' => true,
    ]);
    $application = Application::factory()->create();

    $attempt = AssessmentAttempt::query()->create([
        'assessment_id' => $assessment->id,
        'application_id' => $application->id,
        'attempt_number' => 1,
    ]);
    $attempt->forceFill([
        'access_token' => hash('sha256', 'expired-token'),
        'access_token_expires_at' => now()->subDay(),
    ])->save();

    $this->get(route('assessments.show', 'expired-token'))
        ->assertInertia(fn ($page) => $page
            ->component('public/assessments/link-issue')
            ->where('reason', 'expired'));
});
