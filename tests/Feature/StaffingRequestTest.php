<?php

use App\Models\StaffingRequest;
use Illuminate\Support\Facades\Mail;

test('a facility can submit a staffing request', function () {
    Mail::fake();

    $response = $this->post(route('staffing-requests.store'), [
        'facility_name' => 'Granite Ridge Skilled Nursing',
        'contact_name' => 'Patricia Hale',
        'email' => 'phale@example.com',
        'phone' => '603-555-0142',
        'facility_type' => 'Skilled Nursing Facility',
        'staffing_needs' => 'Need 2 LPNs for evening shifts.',
    ]);

    $response->assertRedirect();

    $staffingRequest = StaffingRequest::query()->where('email', 'phale@example.com')->firstOrFail();
    expect($staffingRequest->status)->toBe('new');
    expect($staffingRequest->facility_name)->toBe('Granite Ridge Skilled Nursing');
});

test('a staffing request requires contact details', function () {
    $response = $this->post(route('staffing-requests.store'), []);

    $response->assertSessionHasErrors(['facility_name', 'contact_name', 'email', 'phone']);
});

test('a staffing request cannot set its own status or handler', function () {
    Mail::fake();

    $response = $this->post(route('staffing-requests.store'), [
        'facility_name' => 'Granite Ridge Skilled Nursing',
        'contact_name' => 'Patricia Hale',
        'email' => 'phale@example.com',
        'phone' => '603-555-0142',
        'status' => 'closed',
        'handled_by' => 999,
    ]);

    $response->assertRedirect();

    $staffingRequest = StaffingRequest::query()->where('email', 'phale@example.com')->firstOrFail();
    expect($staffingRequest->status)->toBe('new');
    expect($staffingRequest->handled_by)->toBeNull();
});
