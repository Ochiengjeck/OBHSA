<?php

use App\Models\Application;
use App\Models\Candidate;
use App\Models\JobListing;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

test('a caregiver can apply to a job listing with a resume', function () {
    Storage::fake('public');
    Mail::fake();

    $listing = JobListing::factory()->create();

    $response = $this->post(route('jobs.apply', $listing), [
        'full_name' => 'Jane Caregiver',
        'email' => 'jane@example.com',
        'phone' => '603-555-0100',
        'resume' => UploadedFile::fake()->create('resume.pdf', 200, 'application/pdf'),
        'cover_note' => 'I would love to work here.',
    ]);

    $response->assertRedirect();

    $candidate = Candidate::query()->where('email', 'jane@example.com')->firstOrFail();
    $application = Application::query()->where('candidate_id', $candidate->id)->firstOrFail();

    expect($application->job_listing_id)->toBe($listing->id);
    expect($application->status)->toBe('submitted');

    $resume = $application->documents()->where('document_type', 'resume')->firstOrFail();
    Storage::disk('public')->assertExists($resume->file_path);

    expect($application->requirements()->count())->toBe(3);
    expect($application->stageHistory()->count())->toBe(1);
});

test('a job application requires a resume file', function () {
    $listing = JobListing::factory()->create();

    $response = $this->post(route('jobs.apply', $listing), [
        'full_name' => 'Jane Caregiver',
        'email' => 'jane@example.com',
        'phone' => '603-555-0100',
    ]);

    $response->assertSessionHasErrors('resume');
});

test('applying twice with the same email reuses the existing candidate', function () {
    Storage::fake('public');
    Mail::fake();

    $listingOne = JobListing::factory()->create();
    $listingTwo = JobListing::factory()->create();

    $payload = fn () => [
        'full_name' => 'Jane Caregiver',
        'email' => 'jane@example.com',
        'phone' => '603-555-0100',
        'resume' => UploadedFile::fake()->create('resume.pdf', 200, 'application/pdf'),
    ];

    $this->post(route('jobs.apply', $listingOne), $payload());
    $this->post(route('jobs.apply', $listingTwo), $payload());

    expect(Candidate::query()->where('email', 'jane@example.com')->count())->toBe(1);
    expect(Application::query()->count())->toBe(2);
});
