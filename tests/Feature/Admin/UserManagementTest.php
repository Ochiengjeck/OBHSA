<?php

use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    $this->seed(RoleSeeder::class);
    $this->admin = User::factory()->create();
    $this->admin->assignRole('admin');
});

test('an admin can create a user with a custom role', function () {
    Role::findOrCreate('recruiter');

    $response = $this->actingAs($this->admin)->post(route('admin.users.store'), [
        'name' => 'Jane Recruiter',
        'email' => 'jane@example.com',
        'role' => 'recruiter',
    ]);

    $response->assertRedirect();

    $user = User::query()->where('email', 'jane@example.com')->firstOrFail();
    expect($user->hasRole('recruiter'))->toBeTrue();
});

test('creating a user rejects a role that does not exist', function () {
    $response = $this->actingAs($this->admin)->post(route('admin.users.store'), [
        'name' => 'Jane Recruiter',
        'email' => 'jane@example.com',
        'role' => 'not-a-real-role',
    ]);

    $response->assertSessionHasErrors('role');
});

test('an admin can generate a new password for a user', function () {
    $user = User::factory()->create();
    $user->assignRole('editor');
    $originalHash = $user->password;

    $response = $this->actingAs($this->admin)->post(route('admin.users.generate-password', $user));

    $response->assertRedirect(route('admin.users.edit', $user));
    expect($user->fresh()->password)->not->toBe($originalHash);
});

test('an admin can set a specific password for a user that the user can then log in with', function () {
    $user = User::factory()->create();
    $user->assignRole('editor');

    $response = $this->actingAs($this->admin)->put(route('admin.users.set-password', $user), [
        'password' => 'a-new-strong-password',
        'password_confirmation' => 'a-new-strong-password',
    ]);

    $response->assertRedirect(route('admin.users.edit', $user));
    expect(Hash::check('a-new-strong-password', $user->fresh()->password))->toBeTrue();
});

test('setting a password requires confirmation', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($this->admin)->put(route('admin.users.set-password', $user), [
        'password' => 'a-new-strong-password',
        'password_confirmation' => 'does-not-match',
    ]);

    $response->assertSessionHasErrors('password');
});

test('an admin can send a password reset link to a user', function () {
    Notification::fake();

    $user = User::factory()->create();

    $response = $this->actingAs($this->admin)->post(route('admin.users.send-reset-link', $user));

    $response->assertRedirect(route('admin.users.edit', $user));
    Notification::assertSentTo($user, ResetPassword::class);
});

test('the users index can be filtered by role', function () {
    $editorUser = User::factory()->create(['name' => 'Edie Editor']);
    $editorUser->assignRole('editor');

    $adminUser = User::factory()->create(['name' => 'Addie Admin']);
    $adminUser->assignRole('admin');

    $response = $this->actingAs($this->admin)->get(route('admin.users.index', ['role' => 'editor']));

    $response->assertInertia(fn ($page) => $page
        ->component('admin/users/index')
        ->where('users.data', fn ($data) => collect($data)->pluck('id')->contains($editorUser->id)
            && ! collect($data)->pluck('id')->contains($adminUser->id)));
});

test('a user without access cannot manage users', function () {
    $editor = User::factory()->create();
    $editor->assignRole('editor');

    $response = $this->actingAs($editor)->get(route('admin.users.index'));

    $response->assertForbidden();
});
