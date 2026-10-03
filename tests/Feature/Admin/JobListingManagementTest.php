<?php

use App\Models\JobListing;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    $this->seed(RoleSeeder::class);
    $this->admin = User::factory()->create();
    $this->admin->assignRole('admin');
});

function jobListingPayload(array $overrides = []): array
{
    return array_merge([
        'title' => 'RN - Per Diem, Manchester NH',
        'specialty' => 'RN',
        'employment_type' => 'per-diem',
        'location_city' => 'Manchester',
        'location_state' => 'NH',
        'shift' => 'day',
        'pay_range_min' => 35,
        'pay_range_max' => 50,
        'description' => 'A great opportunity for an RN.',
        'requirements' => 'Active NH RN license.',
        'is_active' => true,
    ], $overrides);
}

test('an admin can create a job listing with an image', function () {
    Storage::fake('public');

    $response = $this->actingAs($this->admin)->post(route('admin.job-listings.store'), jobListingPayload([
        'image' => fakeImageFile('job.jpg'),
    ]));

    $response->assertRedirect(route('admin.job-listings.index'));

    $jobListing = JobListing::query()->where('title', 'RN - Per Diem, Manchester NH')->firstOrFail();
    expect($jobListing->image_path)->not->toBeNull();
    Storage::disk('public')->assertExists($jobListing->image_path);
});

test('an admin can replace a job listings image', function () {
    Storage::fake('public');
    Storage::disk('public')->put('job-listings/old.jpg', 'fake-bytes');

    $jobListing = JobListing::factory()->create(['image_path' => 'job-listings/old.jpg']);

    $this->actingAs($this->admin)->put(route('admin.job-listings.update', $jobListing), jobListingPayload([
        'image' => fakeImageFile('new.jpg'),
    ]));

    $jobListing->refresh();
    Storage::disk('public')->assertMissing('job-listings/old.jpg');
    Storage::disk('public')->assertExists($jobListing->image_path);
});

test('job listing image upload rejects a non image file', function () {
    $response = $this->actingAs($this->admin)->post(route('admin.job-listings.store'), jobListingPayload([
        'image' => UploadedFile::fake()->create('resume.pdf', 200, 'application/pdf'),
    ]));

    $response->assertSessionHasErrors('image');
});

test('deleting a job listing deletes its image file', function () {
    Storage::fake('public');
    Storage::disk('public')->put('job-listings/photo.jpg', 'fake-bytes');

    $jobListing = JobListing::factory()->create(['image_path' => 'job-listings/photo.jpg']);

    $this->actingAs($this->admin)->delete(route('admin.job-listings.destroy', $jobListing));

    Storage::disk('public')->assertMissing('job-listings/photo.jpg');
    expect(JobListing::query()->find($jobListing->id))->toBeNull();
});
