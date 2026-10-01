<?php

use App\Models\Service;
use App\Models\User;
use Database\Seeders\RoleSeeder;

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

test('an editor without permission cannot delete a job application review data', function () {
    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $response = $this->actingAs($editor)->get(route('admin.job-applications.index'));

    $response->assertForbidden();
});
