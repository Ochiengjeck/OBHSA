<?php

use App\Mail\ApplicationResumeLink;
use App\Models\Application;
use App\Models\Candidate;
use App\Models\JobListing;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

function startWizardApplication(TestCase $test, string $email = 'jane@example.com'): void
{
    $test->post(route('apply.store'), [
        'first_name' => 'Jane',
        'last_name' => 'Caregiver',
        'email' => $email,
        'phone' => '603-555-0100',
    ]);
}

test('a caregiver can complete the full application wizard', function () {
    Storage::fake('public');
    Mail::fake();

    startWizardApplication($this);

    $candidate = Candidate::query()->where('email', 'jane@example.com')->firstOrFail();
    $application = Application::query()->where('candidate_id', $candidate->id)->firstOrFail();

    expect($application->status)->toBe('started');
    expect($application->requirements()->count())->toBe(2);

    $this->get(route('apply.location.edit'))->assertOk();

    $this->put(route('apply.location.update'), [
        'city' => 'Manchester',
        'state' => 'NH',
        'postal_code' => '03102',
    ])->assertRedirect(route('apply.preferences.edit'));

    $this->get(route('apply.preferences.edit'))->assertOk();

    $this->put(route('apply.preferences.update'), [
        'primary_specialty' => 'rn',
        'desired_employment_type' => 'per-diem',
        'desired_start_timeframe' => 'immediately',
        'work_settings' => ['hospital'],
    ])->assertRedirect(route('apply.employment-history.edit'));

    $this->get(route('apply.employment-history.edit'))->assertOk();

    $this->put(route('apply.employment-history.update'), ['rows' => []])
        ->assertRedirect(route('apply.education.edit'));

    $this->get(route('apply.education.edit'))->assertOk();

    $this->put(route('apply.education.update'), ['rows' => []])
        ->assertRedirect(route('apply.documents.edit'));

    $this->get(route('apply.documents.edit'))->assertOk();

    $this->put(route('apply.documents.update'), [
        'resume' => UploadedFile::fake()->create('resume.pdf', 200, 'application/pdf'),
    ])->assertRedirect(route('apply.consent.edit'));

    $this->get(route('apply.consent.edit'))->assertOk();

    $this->put(route('apply.consent.update'), [
        'information_accurate' => true,
        'background_check_consent' => true,
        'signature_name' => 'Jane Caregiver',
    ])->assertRedirect(route('apply.review'));

    $this->get(route('apply.review'))->assertOk();

    $this->post(route('apply.submit'))->assertRedirect(route('apply.thank-you'));

    $this->get(route('apply.thank-you'))->assertOk();

    $application->refresh();

    expect($application->status)->toBe('submitted');
    expect($application->requirements()->count())->toBe(4);
    expect($application->requirements()->where('requirement_type', 'background_check')->exists())->toBeTrue();
    expect($application->stageHistory()->count())->toBe(2);

    $resume = $application->documents()->where('document_type', 'resume')->firstOrFail();
    Storage::disk('public')->assertExists($resume->file_path);
});

test('applying from a job listing carries the listing onto the application', function () {
    Mail::fake();

    $listing = JobListing::factory()->create();

    $this->get(route('apply.create', ['job_listing' => $listing->slug]))->assertOk();

    $this->post(route('apply.store'), [
        'first_name' => 'Lee',
        'last_name' => 'Caregiver',
        'email' => 'lee@example.com',
        'phone' => '603-555-0177',
        'job_listing' => $listing->slug,
    ]);

    $candidate = Candidate::query()->where('email', 'lee@example.com')->firstOrFail();
    $application = Application::query()->where('candidate_id', $candidate->id)->firstOrFail();

    expect($application->job_listing_id)->toBe($listing->id);
});

test('a candidate outside the service area is marked ineligible and stopped', function () {
    Mail::fake();

    startWizardApplication($this, 'sam@example.com');

    $response = $this->put(route('apply.location.update'), [
        'city' => 'Boston',
        'state' => 'MA',
        'postal_code' => '02108',
    ]);

    $response->assertRedirect(route('apply.not-available'));

    $candidate = Candidate::query()->where('email', 'sam@example.com')->firstOrFail();
    $application = Application::query()->where('candidate_id', $candidate->id)->firstOrFail();

    expect($application->status)->toBe('ineligible');

    $requirement = $application->requirements()->where('requirement_type', 'eligibility_screen')->firstOrFail();
    expect($requirement->status)->toBe('failed');
});

test('restarting step one with the same email reuses the open wizard draft', function () {
    Mail::fake();

    startWizardApplication($this, 'reuse@example.com');
    startWizardApplication($this, 'reuse@example.com');

    expect(Candidate::query()->where('email', 'reuse@example.com')->count())->toBe(1);
    expect(Application::query()->count())->toBe(1);
});

test('an invalid resume token shows a generic invalid-link page', function () {
    $this->get(route('apply.resume', 'does-not-exist'))
        ->assertInertia(fn ($page) => $page
            ->component('public/apply/link-issue')
            ->where('reason', 'invalid'));
});

test('an expired resume token shows the link-expired page', function () {
    $application = Application::factory()->create();
    $application->forceFill([
        'resume_token' => hash('sha256', 'expired-token'),
        'resume_token_expires_at' => now()->subDay(),
    ])->save();

    $this->get(route('apply.resume', 'expired-token'))
        ->assertInertia(fn ($page) => $page
            ->component('public/apply/link-issue')
            ->where('reason', 'expired'));
});

test('a valid resume token verifies contact and restores the wizard at the right step', function () {
    Mail::fake();

    startWizardApplication($this, 'amy@example.com');

    $candidate = Candidate::query()->where('email', 'amy@example.com')->firstOrFail();
    $application = Application::query()->where('candidate_id', $candidate->id)->firstOrFail();

    $plaintext = null;
    Mail::assertQueued(ApplicationResumeLink::class, function (ApplicationResumeLink $mail) use (&$plaintext, $application) {
        $plaintext = $mail->plaintextToken;

        return $mail->application->is($application);
    });

    $this->flushSession();

    $this->get(route('apply.resume', $plaintext))
        ->assertRedirect(route('apply.location.edit'));

    expect($candidate->refresh()->contact_verified_at)->not->toBeNull();

    $requirement = $application->requirements()->where('requirement_type', 'contact_verification')->firstOrFail();
    expect($requirement->status)->toBe('passed');
});
