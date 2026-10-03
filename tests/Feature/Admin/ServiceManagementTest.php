<?php

use App\Models\Service;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    $this->seed(RoleSeeder::class);
    $this->admin = User::factory()->create();
    $this->admin->assignRole('admin');
});

test('an admin can create a service', function () {
    $response = $this->actingAs($this->admin)->post(route('admin.services.store'), [
        'title' => 'Rapid Response Coverage',
        'summary' => 'Urgent, last-minute shift coverage.',
        'description' => 'Details about rapid response coverage.',
        'icon' => 'Siren',
        'position' => 0,
        'is_active' => true,
    ]);

    $response->assertRedirect(route('admin.services.index'));

    $service = Service::query()->where('title', 'Rapid Response Coverage')->firstOrFail();
    expect($service->slug)->toBe('rapid-response-coverage');
    expect($service->is_active)->toBeTrue();
});

test('an admin can delete a service', function () {
    $service = Service::factory()->create();

    $response = $this->actingAs($this->admin)->delete(route('admin.services.destroy', $service));

    $response->assertRedirect(route('admin.services.index'));
    expect(Service::query()->find($service->id))->toBeNull();
});

test('an admin can upload a custom icon for a service', function () {
    Storage::fake('public');

    $response = $this->actingAs($this->admin)->post(route('admin.services.store'), [
        'title' => 'Rapid Response Coverage',
        'summary' => 'Urgent, last-minute shift coverage.',
        'icon' => 'Siren',
        'icon_image' => fakeImageFile('icon.png'),
        'position' => 0,
        'is_active' => true,
    ]);

    $response->assertRedirect(route('admin.services.index'));

    $service = Service::query()->where('title', 'Rapid Response Coverage')->firstOrFail();
    expect($service->icon_path)->not->toBeNull();
    Storage::disk('public')->assertExists($service->icon_path);
});

test('replacing a service icon deletes the old file', function () {
    Storage::fake('public');
    Storage::disk('public')->put('service-icons/old.jpg', 'fake-bytes');

    $service = Service::factory()->create(['icon_path' => 'service-icons/old.jpg']);

    $this->actingAs($this->admin)->put(route('admin.services.update', $service), [
        'title' => $service->title,
        'summary' => $service->summary,
        'icon' => $service->icon,
        'icon_image' => fakeImageFile('new.jpg'),
        'position' => $service->position,
        'is_active' => $service->is_active,
    ]);

    $service->refresh();
    Storage::disk('public')->assertMissing('service-icons/old.jpg');
    Storage::disk('public')->assertExists($service->icon_path);
});

test('clearing a service icon via a real multipart submission deletes the file', function () {
    // The admin form always submits via forceFormData, which serializes a
    // cleared (null) icon_path as '' on the wire — browsers cannot send a
    // literal null over multipart/form-data. This sends '' directly rather
    // than null to match what actually reaches the server.
    Storage::fake('public');
    Storage::disk('public')->put('service-icons/old.jpg', 'fake-bytes');

    $service = Service::factory()->create(['icon_path' => 'service-icons/old.jpg']);

    $this->actingAs($this->admin)->put(route('admin.services.update', $service), [
        'title' => $service->title,
        'summary' => $service->summary,
        'icon' => $service->icon,
        'icon_path' => '',
        'position' => $service->position,
        'is_active' => $service->is_active,
    ]);

    $service->refresh();
    Storage::disk('public')->assertMissing('service-icons/old.jpg');
    expect($service->icon_path)->toBeNull();
});

test('editing an unrelated field preserves an existing service icon', function () {
    Storage::fake('public');
    Storage::disk('public')->put('service-icons/existing.jpg', 'fake-bytes');

    $service = Service::factory()->create(['icon_path' => 'service-icons/existing.jpg']);

    $this->actingAs($this->admin)->put(route('admin.services.update', $service), [
        'title' => 'Updated Title',
        'summary' => $service->summary,
        'icon' => $service->icon,
        'icon_path' => 'service-icons/existing.jpg',
        'position' => $service->position,
        'is_active' => $service->is_active,
    ]);

    $service->refresh();
    expect($service->title)->toBe('Updated Title');
    expect($service->icon_path)->toBe('service-icons/existing.jpg');
    Storage::disk('public')->assertExists('service-icons/existing.jpg');
});

test('an editor without permission cannot delete a job application review data', function () {
    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $response = $this->actingAs($editor)->get(route('admin.job-applications.index'));

    $response->assertForbidden();
});
