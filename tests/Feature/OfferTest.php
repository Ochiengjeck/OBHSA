<?php

use App\Mail\OfferLetter;
use App\Models\Application;
use App\Models\Offer;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

beforeEach(function () {
    $this->seed(RoleSeeder::class);
    $this->admin = User::factory()->create();
    $this->admin->assignRole('admin');
});

function extendOffer(TestCase $test, Application $application, User $admin): string
{
    $plaintext = null;

    Mail::fake();

    $test->actingAs($admin)->post(route('admin.job-applications.offers.store', $application), [
        'position' => 'RN - ICU',
        'pay_rate' => 42.50,
        'employment_type' => 'full_time',
        'start_date' => now()->addWeeks(2)->toDateString(),
        'notes' => 'Welcome aboard!',
    ]);

    Mail::assertQueued(OfferLetter::class, function (OfferLetter $mail) use (&$plaintext) {
        $plaintext = $mail->plaintextToken;

        return true;
    });

    return $plaintext;
}

test('extending an offer creates it, issues a token, and queues the offer letter', function () {
    $application = Application::factory()->create();

    $token = extendOffer($this, $application, $this->admin);

    $offer = Offer::query()->where('application_id', $application->id)->firstOrFail();
    expect($offer->status)->toBe('pending');
    expect($offer->position)->toBe('RN - ICU');
    expect($offer->extended_by)->toBe($this->admin->id);
    expect(hash('sha256', $token))->toBe($offer->access_token);
});

test('a candidate can accept an offer via their emailed link', function () {
    $application = Application::factory()->create();
    $token = extendOffer($this, $application, $this->admin);

    $offer = Offer::query()->where('application_id', $application->id)->firstOrFail();

    $this->get(route('offers.show', $token))
        ->assertInertia(fn ($page) => $page
            ->component('public/offers/show')
            ->where('offer.id', $offer->id));

    $response = $this->post(route('offers.respond', $token), ['action' => 'accept']);

    $response->assertRedirect(route('offers.thank-you'));
    expect($offer->fresh()->status)->toBe('accepted');
});

test('a candidate can decline an offer via their emailed link with a reason', function () {
    $application = Application::factory()->create();
    $token = extendOffer($this, $application, $this->admin);
    $offer = Offer::query()->where('application_id', $application->id)->firstOrFail();

    $this->post(route('offers.respond', $token), [
        'action' => 'decline',
        'decline_reason' => 'Accepted another position.',
    ]);

    $offer->refresh();
    expect($offer->status)->toBe('declined');
    expect($offer->decline_reason)->toBe('Accepted another position.');
});

test('staff can manually override an offer as accepted', function () {
    $application = Application::factory()->create();
    extendOffer($this, $application, $this->admin);
    $offer = Offer::query()->where('application_id', $application->id)->firstOrFail();

    $this->actingAs($this->admin)->put(route('admin.offers.update', $offer), [
        'status' => 'accepted',
    ]);

    expect($offer->fresh()->status)->toBe('accepted');
});

test('staff can withdraw a pending offer', function () {
    $application = Application::factory()->create();
    extendOffer($this, $application, $this->admin);
    $offer = Offer::query()->where('application_id', $application->id)->firstOrFail();

    $this->actingAs($this->admin)->put(route('admin.offers.update', $offer), [
        'status' => 'withdrawn',
    ]);

    expect($offer->fresh()->status)->toBe('withdrawn');
});

test('an invalid offer token shows a generic invalid-link page', function () {
    $this->get(route('offers.show', 'does-not-exist'))
        ->assertInertia(fn ($page) => $page
            ->component('public/offers/link-issue')
            ->where('reason', 'invalid'));
});

test('an expired offer token shows the link-expired page', function () {
    $application = Application::factory()->create();
    $offer = Offer::query()->create([
        'application_id' => $application->id,
        'position' => 'RN - ICU',
        'pay_rate' => 40,
        'employment_type' => 'full_time',
        'start_date' => now()->addWeek(),
    ]);
    $offer->forceFill([
        'access_token' => hash('sha256', 'expired-token'),
        'access_token_expires_at' => now()->subDay(),
    ])->save();

    $this->get(route('offers.show', 'expired-token'))
        ->assertInertia(fn ($page) => $page
            ->component('public/offers/link-issue')
            ->where('reason', 'expired'));
});

test('a user without applications.create cannot extend an offer', function () {
    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $application = Application::factory()->create();

    $this->actingAs($editor)->post(route('admin.job-applications.offers.store', $application), [
        'position' => 'RN - ICU',
        'pay_rate' => 42.50,
        'employment_type' => 'full_time',
        'start_date' => now()->addWeeks(2)->toDateString(),
    ])->assertForbidden();
});
