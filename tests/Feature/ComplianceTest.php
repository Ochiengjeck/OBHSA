<?php

use App\Console\Commands\CheckCredentialExpirations;
use App\Mail\CredentialExpiryStaffAlert;
use App\Mail\CredentialExpiryWarning;
use App\Models\Candidate;
use App\Models\Credential;
use App\Models\CredentialExpiryNotification;
use App\Models\Employee;
use Illuminate\Support\Facades\Mail;

function createActiveEmployeeWithCredential(int $expiryDaysFromNow): Credential
{
    $candidate = Candidate::factory()->create();

    Employee::query()->create([
        'candidate_id' => $candidate->id,
        'hire_date' => now()->subMonth()->toDateString(),
    ]);

    return Credential::query()->create([
        'candidate_id' => $candidate->id,
        'credential_type' => 'license',
        'credential_name' => 'RN License',
        'expiry_date' => now()->addDays($expiryDaysFromNow)->toDateString(),
    ]);
}

test('a credential expiring within 7 days triggers a 7_day notification', function () {
    Mail::fake();

    $credential = createActiveEmployeeWithCredential(5);

    $this->artisan(CheckCredentialExpirations::class)->assertSuccessful();

    $notification = CredentialExpiryNotification::query()->where('credential_id', $credential->id)->firstOrFail();
    expect($notification->stage)->toBe('7_day');

    Mail::assertQueued(CredentialExpiryWarning::class, fn (CredentialExpiryWarning $mail) => $mail->credential->is($credential) && $mail->stage === '7_day');
    Mail::assertQueued(CredentialExpiryStaffAlert::class, fn (CredentialExpiryStaffAlert $mail) => $mail->credential->is($credential) && $mail->stage === '7_day');
});

test('a credential expiring in 45 days triggers a 60_day notification', function () {
    Mail::fake();

    $credential = createActiveEmployeeWithCredential(45);

    $this->artisan(CheckCredentialExpirations::class)->assertSuccessful();

    $notification = CredentialExpiryNotification::query()->where('credential_id', $credential->id)->firstOrFail();
    expect($notification->stage)->toBe('60_day');
});

test('an already-expired credential triggers an overdue notification', function () {
    Mail::fake();

    $credential = createActiveEmployeeWithCredential(-3);

    $this->artisan(CheckCredentialExpirations::class)->assertSuccessful();

    $notification = CredentialExpiryNotification::query()->where('credential_id', $credential->id)->firstOrFail();
    expect($notification->stage)->toBe('overdue');
});

test('a credential expiring beyond the 60-day window triggers no notification', function () {
    Mail::fake();

    $credential = createActiveEmployeeWithCredential(90);

    $this->artisan(CheckCredentialExpirations::class)->assertSuccessful();

    expect(CredentialExpiryNotification::query()->where('credential_id', $credential->id)->exists())->toBeFalse();
    Mail::assertNothingQueued();
});

test('a credential belonging to a candidate without an active employee is skipped', function () {
    Mail::fake();

    $candidate = Candidate::factory()->create();
    $credential = Credential::query()->create([
        'candidate_id' => $candidate->id,
        'credential_type' => 'license',
        'credential_name' => 'RN License',
        'expiry_date' => now()->addDays(5)->toDateString(),
    ]);

    $this->artisan(CheckCredentialExpirations::class)->assertSuccessful();

    expect(CredentialExpiryNotification::query()->where('credential_id', $credential->id)->exists())->toBeFalse();
    Mail::assertNothingQueued();
});

test('running the command twice never sends a duplicate notification for the same stage', function () {
    Mail::fake();

    $credential = createActiveEmployeeWithCredential(5);

    $this->artisan(CheckCredentialExpirations::class)->assertSuccessful();
    $this->artisan(CheckCredentialExpirations::class)->assertSuccessful();

    expect(CredentialExpiryNotification::query()->where('credential_id', $credential->id)->count())->toBe(1);
    Mail::assertQueued(CredentialExpiryWarning::class, 1);
});
