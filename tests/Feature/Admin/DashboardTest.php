<?php

use App\Models\Application;
use App\Models\StaffingRequest;
use App\Models\User;
use Database\Seeders\RoleSeeder;

beforeEach(function () {
    $this->seed(RoleSeeder::class);
    $this->admin = User::factory()->create();
    $this->admin->assignRole('admin');
});

test('the dashboard renders counts, pipeline, needs-attention, and upcoming interviews', function () {
    Application::factory()->submitted()->create();
    StaffingRequest::query()->create([
        'facility_name' => 'Test Facility',
        'contact_name' => 'Jane Doe',
        'email' => 'jane@example.com',
        'phone' => '555-0100',
        'status' => 'new',
    ]);

    $response = $this->actingAs($this->admin)->get(route('admin.dashboard'));

    $response->assertOk();
    $response->assertInertia(
        fn ($page) => $page
            ->component('admin/dashboard')
            ->where('counts.newApplications', 1)
            ->where('counts.newLeads', 1)
            ->has('counts.activeJobListings')
            ->has('counts.publishedPosts')
            ->has('counts.interviewsThisWeek')
            ->has('counts.offersExpiringSoon')
            ->has('counts.credentialsExpiringSoon')
            ->has('counts.openShifts')
            ->has('pipeline')
            ->has('needsAttention')
            ->has('upcomingInterviews'),
    );
});

test('a user without access cannot view the dashboard', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('admin.dashboard'));

    $response->assertForbidden();
});
