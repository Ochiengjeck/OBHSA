<?php

use App\Models\Candidate;
use App\Models\Employee;
use App\Models\Facility;
use App\Models\Shift;
use App\Models\User;
use Database\Seeders\RoleSeeder;

beforeEach(function () {
    $this->seed(RoleSeeder::class);
    $this->admin = User::factory()->create();
    $this->admin->assignRole('admin');
});

function createFacility(): Facility
{
    return Facility::query()->create([
        'name' => 'Riverside General Hospital',
        'address_line1' => '123 Main St',
        'city' => 'Springfield',
        'state' => 'IL',
        'postal_code' => '62701',
        'facility_type' => 'hospital',
    ]);
}

function createActiveEmployee(string $specialty = 'rn'): Employee
{
    $candidate = Candidate::factory()->create();

    return Employee::query()->create([
        'candidate_id' => $candidate->id,
        'hire_date' => now()->subMonth()->toDateString(),
        'specialty' => $specialty,
    ]);
}

test('scheduling a shift at a facility works', function () {
    $facility = createFacility();

    $response = $this->actingAs($this->admin)->post(route('admin.facilities.shifts.store', $facility), [
        'specialty' => 'rn',
        'shift_date' => now()->addDays(3)->toDateString(),
        'start_time' => '07:00',
        'end_time' => '19:00',
        'slots_needed' => 2,
    ]);

    $response->assertRedirect(route('admin.facilities.shifts.index', $facility));

    $shift = Shift::query()->where('facility_id', $facility->id)->firstOrFail();
    expect($shift->status)->toBe('open');
    expect($shift->slots_needed)->toBe(2);
    expect($shift->created_by)->toBe($this->admin->id);
});

test('assigning employees fills a shift once slots_needed is reached', function () {
    $facility = createFacility();
    $shift = $facility->shifts()->create([
        'specialty' => 'rn',
        'shift_date' => now()->addDays(3)->toDateString(),
        'start_time' => '07:00',
        'end_time' => '19:00',
        'slots_needed' => 2,
    ]);

    $employeeOne = createActiveEmployee('rn');
    $employeeTwo = createActiveEmployee('rn');

    $this->actingAs($this->admin)->post(route('admin.shifts.assignments.store', $shift), [
        'employee_id' => $employeeOne->id,
    ]);

    expect($shift->fresh()->status)->toBe('open');

    $this->actingAs($this->admin)->post(route('admin.shifts.assignments.store', $shift), [
        'employee_id' => $employeeTwo->id,
    ]);

    expect($shift->fresh()->status)->toBe('filled');
    expect($shift->assignments()->count())->toBe(2);
});

test('cancelling an assignment reopens a filled shift', function () {
    $facility = createFacility();
    $shift = $facility->shifts()->create([
        'specialty' => 'rn',
        'shift_date' => now()->addDays(3)->toDateString(),
        'start_time' => '07:00',
        'end_time' => '19:00',
        'slots_needed' => 1,
    ]);

    $employee = createActiveEmployee('rn');

    $this->actingAs($this->admin)->post(route('admin.shifts.assignments.store', $shift), [
        'employee_id' => $employee->id,
    ]);
    expect($shift->fresh()->status)->toBe('filled');

    $assignment = $shift->assignments()->firstOrFail();

    $this->actingAs($this->admin)->put(route('admin.shift-assignments.update', $assignment), [
        'status' => 'cancelled',
    ]);

    expect($shift->fresh()->status)->toBe('open');
    expect($assignment->fresh()->status)->toBe('cancelled');
});

test('an employee with the wrong specialty cannot be assigned to a shift', function () {
    $facility = createFacility();
    $shift = $facility->shifts()->create([
        'specialty' => 'rn',
        'shift_date' => now()->addDays(3)->toDateString(),
        'start_time' => '07:00',
        'end_time' => '19:00',
        'slots_needed' => 1,
    ]);

    $employee = createActiveEmployee('cna');

    $this->actingAs($this->admin)->post(route('admin.shifts.assignments.store', $shift), [
        'employee_id' => $employee->id,
    ])->assertSessionHasErrors('employee_id');

    expect($shift->assignments()->count())->toBe(0);
});

test('an inactive employee cannot be assigned to a shift', function () {
    $facility = createFacility();
    $shift = $facility->shifts()->create([
        'specialty' => 'rn',
        'shift_date' => now()->addDays(3)->toDateString(),
        'start_time' => '07:00',
        'end_time' => '19:00',
        'slots_needed' => 1,
    ]);

    $employee = createActiveEmployee('rn');
    $employee->terminate();

    $this->actingAs($this->admin)->post(route('admin.shifts.assignments.store', $shift), [
        'employee_id' => $employee->id,
    ])->assertSessionHasErrors('employee_id');
});

test('the available-employees list on a shift excludes already-assigned and mismatched employees', function () {
    $facility = createFacility();
    $shift = $facility->shifts()->create([
        'specialty' => 'rn',
        'shift_date' => now()->addDays(3)->toDateString(),
        'start_time' => '07:00',
        'end_time' => '19:00',
        'slots_needed' => 2,
    ]);

    $assignedEmployee = createActiveEmployee('rn');
    $wrongSpecialtyEmployee = createActiveEmployee('cna');
    $availableEmployee = createActiveEmployee('rn');

    $shift->assignments()->create([
        'employee_id' => $assignedEmployee->id,
        'assigned_at' => now(),
    ]);

    $response = $this->actingAs($this->admin)->get(route('admin.shifts.show', $shift));

    $response->assertInertia(fn ($page) => $page
        ->component('admin/facilities/shifts/show')
        ->has('availableEmployees', 1)
        ->where('availableEmployees.0.id', $availableEmployee->id));

    expect($wrongSpecialtyEmployee)->not->toBeNull();
});

test('cancelling a shift stops it from auto-reopening when an assignment is cancelled', function () {
    $facility = createFacility();
    $shift = $facility->shifts()->create([
        'specialty' => 'rn',
        'shift_date' => now()->addDays(3)->toDateString(),
        'start_time' => '07:00',
        'end_time' => '19:00',
        'slots_needed' => 1,
    ]);
    $employee = createActiveEmployee('rn');
    $assignment = $shift->assignments()->create([
        'employee_id' => $employee->id,
        'assigned_at' => now(),
    ]);
    $shift->recomputeStatus();

    $shift->cancel();

    $this->actingAs($this->admin)->put(route('admin.shift-assignments.update', $assignment), [
        'status' => 'cancelled',
    ]);

    expect($shift->fresh()->status)->toBe('cancelled');
});

test('an editor cannot manage facilities or shifts', function () {
    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $facility = createFacility();

    $this->actingAs($editor)->get(route('admin.facilities.index'))->assertForbidden();
    $this->actingAs($editor)->post(route('admin.facilities.shifts.store', $facility), [])->assertForbidden();
});
