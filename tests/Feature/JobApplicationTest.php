<?php

use App\Models\JobApplication;
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

    $application = JobApplication::query()->where('email', 'jane@example.com')->firstOrFail();
    expect($application->job_listing_id)->toBe($listing->id);
    expect($application->status)->toBe('new');

    Storage::disk('public')->assertExists($application->resume_path);
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
