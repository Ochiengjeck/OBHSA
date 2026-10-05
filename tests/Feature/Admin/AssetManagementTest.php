<?php

use App\Models\Service;
use App\Models\Stat;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('public');
    $this->seed(RoleSeeder::class);
    $this->admin = User::factory()->create();
    $this->admin->assignRole('admin');
    $this->editor = User::factory()->create();
    $this->editor->assignRole('editor');
});

test('a user without permission cannot view the asset manager', function () {
    $this->actingAs($this->editor)->get(route('admin.assets.index'))->assertForbidden();
});

test('a user without permission cannot delete assets', function () {
    Storage::disk('public')->put('services/orphan.png', 'bytes');

    $this->actingAs($this->editor)->deleteJson(route('admin.assets.destroy'), [
        'paths' => ['services/orphan.png'],
    ])->assertForbidden();

    Storage::disk('public')->assertExists('services/orphan.png');
});

test('an admin can view the asset manager listing legacy and in-use files', function () {
    Storage::disk('public')->put('services/orphan.png', 'bytes');
    Storage::disk('public')->put('stat-icons/icon.png', 'bytes');
    Stat::factory()->create(['icon_path' => 'stat-icons/icon.png']);

    $response = $this->actingAs($this->admin)->get(route('admin.assets.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/assets/index')
        ->where('counts.total', 2)
        ->where('counts.legacy', 1)
        ->where('counts.in_use', 1)
    );
});

test('the index can be filtered by status', function () {
    Storage::disk('public')->put('services/orphan.png', 'bytes');
    Storage::disk('public')->put('stat-icons/icon.png', 'bytes');
    Stat::factory()->create(['icon_path' => 'stat-icons/icon.png']);

    $response = $this->actingAs($this->admin)->get(route('admin.assets.index', ['status' => 'legacy']));

    $response->assertInertia(fn ($page) => $page
        ->where('assets.data.0.path', 'services/orphan.png')
        ->where('assets.total', 1)
    );
});

test('the index can be filtered by type', function () {
    Storage::disk('public')->put('services/image.png', 'bytes');
    Storage::disk('public')->put('resumes/resume.pdf', 'bytes');

    $response = $this->actingAs($this->admin)->get(route('admin.assets.index', ['type' => 'document']));

    $response->assertInertia(fn ($page) => $page
        ->where('assets.data.0.path', 'resumes/resume.pdf')
        ->where('assets.total', 1)
    );
});

test('the index can be searched by path or used-by text', function () {
    Storage::disk('public')->put('services/orphan.png', 'bytes');
    Storage::disk('public')->put('stat-icons/icon.png', 'bytes');
    Stat::factory()->create(['icon_path' => 'stat-icons/icon.png', 'label' => 'Unique Label Xyz']);

    $response = $this->actingAs($this->admin)->get(route('admin.assets.index', ['search' => 'Unique Label']));

    $response->assertInertia(fn ($page) => $page
        ->where('assets.data.0.path', 'stat-icons/icon.png')
        ->where('assets.total', 1)
    );
});

test('destroying a legacy path deletes it and reports success', function () {
    Storage::disk('public')->put('services/orphan.png', 'bytes');

    $response = $this->actingAs($this->admin)->deleteJson(route('admin.assets.destroy'), [
        'paths' => ['services/orphan.png'],
    ]);

    $response->assertOk();
    $response->assertJson(['results' => [
        ['path' => 'services/orphan.png', 'deleted' => true, 'reason' => null, 'used_by' => null],
    ]]);
    Storage::disk('public')->assertMissing('services/orphan.png');
});

test('destroying an in-use path is refused and the file survives', function () {
    Storage::disk('public')->put('stat-icons/icon.png', 'bytes');
    $stat = Stat::factory()->create(['icon_path' => 'stat-icons/icon.png']);

    $response = $this->actingAs($this->admin)->deleteJson(route('admin.assets.destroy'), [
        'paths' => ['stat-icons/icon.png'],
    ]);

    $response->assertOk();
    $results = $response->json('results');
    expect($results[0]['deleted'])->toBeFalse();
    expect($results[0]['reason'])->toBe('in_use');
    expect($results[0]['used_by'])->toContain($stat->label);
    Storage::disk('public')->assertExists('stat-icons/icon.png');
});

test('a mixed batch deletes the legacy path and refuses the in-use one', function () {
    Storage::disk('public')->put('services/orphan.png', 'bytes');
    Storage::disk('public')->put('stat-icons/icon.png', 'bytes');
    Stat::factory()->create(['icon_path' => 'stat-icons/icon.png']);

    $response = $this->actingAs($this->admin)->deleteJson(route('admin.assets.destroy'), [
        'paths' => ['services/orphan.png', 'stat-icons/icon.png'],
    ]);

    $response->assertOk();
    Storage::disk('public')->assertMissing('services/orphan.png');
    Storage::disk('public')->assertExists('stat-icons/icon.png');
});

test('destroying a path that no longer exists is reported, not silently treated as success', function () {
    $response = $this->actingAs($this->admin)->deleteJson(route('admin.assets.destroy'), [
        'paths' => ['services/never-existed.png'],
    ]);

    $response->assertOk();
    $results = $response->json('results');
    expect($results[0]['deleted'])->toBeFalse();
    expect($results[0]['reason'])->toBe('not_found');
});

test('a path traversal attempt is rejected by validation', function () {
    $response = $this->actingAs($this->admin)->deleteJson(route('admin.assets.destroy'), [
        'paths' => ['../../.env'],
    ]);

    $response->assertStatus(422);
});

test('an in-use file is never deleted even if the request claims it is legacy', function () {
    Storage::disk('public')->put('services/image.png', 'bytes');
    Service::factory()->create(['image_path' => 'services/image.png', 'icon_path' => null]);

    $this->actingAs($this->admin)->deleteJson(route('admin.assets.destroy'), [
        'paths' => ['services/image.png'],
    ]);

    Storage::disk('public')->assertExists('services/image.png');
});
