<?php

use App\Models\User;
use Database\Seeders\RoleSeeder;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    $this->seed(RoleSeeder::class);
    $this->admin = User::factory()->create();
    $this->admin->assignRole('admin');
});

test('an admin can create a role with a subset of permissions', function () {
    $response = $this->actingAs($this->admin)->post(route('admin.roles.store'), [
        'name' => 'recruiter',
        'permissions' => ['applications.view', 'staffing-requests.view'],
    ]);

    $response->assertRedirect(route('admin.roles.index'));

    $role = Role::query()->where('name', 'recruiter')->firstOrFail();
    expect($role->permissions()->pluck('name')->sort()->values()->all())
        ->toBe(['applications.view', 'staffing-requests.view']);
});

test('an admin can update a role\'s permissions', function () {
    $role = Role::findOrCreate('recruiter');
    $role->syncPermissions(['applications.view']);

    $this->actingAs($this->admin)->put(route('admin.roles.update', $role), [
        'name' => 'recruiter',
        'permissions' => ['staffing-requests.view'],
    ]);

    $role->refresh();
    expect($role->permissions()->pluck('name')->all())->toBe(['staffing-requests.view']);
});

test('the admin role cannot be renamed', function () {
    $adminRole = Role::query()->where('name', 'admin')->firstOrFail();

    $this->actingAs($this->admin)->put(route('admin.roles.update', $adminRole), [
        'name' => 'super-admin',
        'permissions' => $adminRole->permissions()->pluck('name')->all(),
    ]);

    expect($adminRole->fresh()->name)->toBe('admin');
});

test('the admin role cannot be deleted', function () {
    $adminRole = Role::query()->where('name', 'admin')->firstOrFail();

    $response = $this->actingAs($this->admin)->delete(route('admin.roles.destroy', $adminRole));

    $response->assertStatus(422);
    expect(Role::query()->where('name', 'admin')->exists())->toBeTrue();
});

test('the editor role cannot be deleted', function () {
    $editorRole = Role::query()->where('name', 'editor')->firstOrFail();

    $response = $this->actingAs($this->admin)->delete(route('admin.roles.destroy', $editorRole));

    $response->assertStatus(422);
    expect(Role::query()->where('name', 'editor')->exists())->toBeTrue();
});

test('a role with assigned users cannot be deleted', function () {
    $role = Role::findOrCreate('recruiter');
    $user = User::factory()->create();
    $user->assignRole('recruiter');

    $response = $this->actingAs($this->admin)->delete(route('admin.roles.destroy', $role));

    $response->assertStatus(422);
    expect(Role::query()->whereKey($role->id)->exists())->toBeTrue();
});

test('an unused custom role can be deleted', function () {
    $role = Role::findOrCreate('recruiter');

    $response = $this->actingAs($this->admin)->delete(route('admin.roles.destroy', $role));

    $response->assertRedirect(route('admin.roles.index'));
    expect(Role::query()->whereKey($role->id)->exists())->toBeFalse();
});

test('a user without access cannot manage roles', function () {
    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $response = $this->actingAs($editor)->get(route('admin.roles.index'));

    $response->assertForbidden();
});
