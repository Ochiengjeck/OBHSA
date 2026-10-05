<?php

use App\Models\Stat;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    $this->seed(RoleSeeder::class);
    $this->admin = User::factory()->create();
    $this->admin->assignRole('admin');
});

test('an admin can create a stat', function () {
    $response = $this->actingAs($this->admin)->post(route('admin.stats.store'), [
        'label' => 'Caregivers Placed',
        'value' => '1,200+',
        'icon' => 'Users',
        'position' => 0,
        'is_active' => true,
    ]);

    $response->assertRedirect(route('admin.stats.index'));

    $stat = Stat::query()->where('label', 'Caregivers Placed')->firstOrFail();
    expect($stat->value)->toBe('1,200+');
    expect($stat->icon)->toBe('Users');
});

test('an admin can upload a custom icon for a stat', function () {
    Storage::fake('public');

    $response = $this->actingAs($this->admin)->post(route('admin.stats.store'), [
        'label' => 'Caregivers Placed',
        'value' => '1,200+',
        'icon_image' => fakeImageFile('icon.png'),
        'position' => 0,
        'is_active' => true,
    ]);

    $response->assertRedirect(route('admin.stats.index'));

    $stat = Stat::query()->where('label', 'Caregivers Placed')->firstOrFail();
    expect($stat->icon_path)->not->toBeNull();
    Storage::disk('public')->assertExists($stat->icon_path);
});

test('replacing a stat icon deletes the old file', function () {
    Storage::fake('public');
    Storage::disk('public')->put('stat-icons/old.jpg', 'fake-bytes');

    $stat = Stat::factory()->create(['icon_path' => 'stat-icons/old.jpg']);

    $this->actingAs($this->admin)->put(route('admin.stats.update', $stat), [
        'label' => $stat->label,
        'value' => $stat->value,
        'icon_image' => fakeImageFile('new.jpg'),
        'position' => $stat->position,
        'is_active' => $stat->is_active,
    ]);

    $stat->refresh();
    Storage::disk('public')->assertMissing('stat-icons/old.jpg');
    Storage::disk('public')->assertExists($stat->icon_path);
});

test('clearing a stat icon via a real multipart submission deletes the file', function () {
    // Mirrors the service-icon test: the admin form submits via forceFormData,
    // which serializes a cleared (null) icon_path as '' on the wire.
    Storage::fake('public');
    Storage::disk('public')->put('stat-icons/old.jpg', 'fake-bytes');

    $stat = Stat::factory()->create(['icon_path' => 'stat-icons/old.jpg']);

    $this->actingAs($this->admin)->put(route('admin.stats.update', $stat), [
        'label' => $stat->label,
        'value' => $stat->value,
        'icon_path' => '',
        'position' => $stat->position,
        'is_active' => $stat->is_active,
    ]);

    $stat->refresh();
    Storage::disk('public')->assertMissing('stat-icons/old.jpg');
    expect($stat->icon_path)->toBeNull();
});

test('editing an unrelated field preserves an existing stat icon', function () {
    Storage::fake('public');
    Storage::disk('public')->put('stat-icons/existing.jpg', 'fake-bytes');

    $stat = Stat::factory()->create(['icon_path' => 'stat-icons/existing.jpg']);

    $this->actingAs($this->admin)->put(route('admin.stats.update', $stat), [
        'label' => 'Updated Label',
        'value' => $stat->value,
        'icon_path' => 'stat-icons/existing.jpg',
        'position' => $stat->position,
        'is_active' => $stat->is_active,
    ]);

    $stat->refresh();
    expect($stat->label)->toBe('Updated Label');
    expect($stat->icon_path)->toBe('stat-icons/existing.jpg');
    Storage::disk('public')->assertExists('stat-icons/existing.jpg');
});

test('an admin can delete a stat', function () {
    $stat = Stat::factory()->create();

    $response = $this->actingAs($this->admin)->delete(route('admin.stats.destroy', $stat));

    $response->assertRedirect(route('admin.stats.index'));
    expect(Stat::query()->find($stat->id))->toBeNull();
});

test('deleting a stat also deletes its icon file', function () {
    Storage::fake('public');
    Storage::disk('public')->put('stat-icons/icon.jpg', 'fake-bytes');

    $stat = Stat::factory()->create(['icon_path' => 'stat-icons/icon.jpg']);

    $this->actingAs($this->admin)->delete(route('admin.stats.destroy', $stat));

    Storage::disk('public')->assertMissing('stat-icons/icon.jpg');
});

test('a user without access cannot create a stat', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('admin.stats.store'), [
        'label' => 'Caregivers Placed',
        'value' => '1,200+',
        'position' => 0,
        'is_active' => true,
    ]);

    $response->assertForbidden();
});
