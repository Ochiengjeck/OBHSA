<?php

use App\Enums\ApplicationStatus;
use App\Exceptions\InvalidApplicationTransitionException;
use App\Models\Application;
use App\Models\User;

test('a legal transition updates the status and records history', function () {
    $application = Application::factory()->create();

    expect($application->status)->toBe('draft');

    $application->transitionTo(ApplicationStatus::Submitted, actor: null, reasonCode: 'test');

    expect($application->fresh()->status)->toBe('submitted');

    $history = $application->stageHistory()->firstOrFail();
    expect($history->from_status)->toBe('draft');
    expect($history->to_status)->toBe('submitted');
});

test('an illegal transition is rejected and leaves the status unchanged', function () {
    $application = Application::factory()->create();

    expect(fn () => $application->transitionTo(ApplicationStatus::Active))
        ->toThrow(InvalidApplicationTransitionException::class);

    expect($application->fresh()->status)->toBe('draft');
    expect($application->stageHistory()->count())->toBe(0);
});

test('the acting admin is recorded on a transition', function () {
    $admin = User::factory()->create();
    $application = Application::factory()->create();

    $application->transitionTo(ApplicationStatus::Submitted, actor: $admin, reasonCode: 'test');
    $application->transitionTo(ApplicationStatus::EligibilityReview, actor: $admin);

    $history = $application->stageHistory()->latest('occurred_at')->firstOrFail();
    expect($history->changed_by)->toBe($admin->id);
});
