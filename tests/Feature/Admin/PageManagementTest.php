<?php

use App\Models\Page;
use App\Models\PageSection;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    $this->seed(RoleSeeder::class);
    $this->admin = User::factory()->create();
    $this->admin->assignRole('admin');
});

function heroPayload(array $overrides = []): array
{
    return array_merge([
        'heading' => 'Test Heading',
        'subheading' => 'Test subheading',
        'primary_cta_label' => null,
        'primary_cta_url' => null,
        'secondary_cta_label' => null,
        'secondary_cta_url' => null,
    ], $overrides);
}

test('an admin can upload a hero section image', function () {
    Storage::fake('public');

    $page = Page::factory()->create();
    $section = PageSection::factory()->for($page)->create();

    $response = $this->actingAs($this->admin)->put(route('admin.pages.update', $page), [
        'title' => $page->title,
        'meta_description' => $page->meta_description,
        'is_published' => true,
        'sections' => [[
            'id' => $section->id,
            'is_visible' => true,
            'position' => 0,
            'content' => heroPayload(['image' => fakeImageFile('hero.jpg')]),
        ]],
    ]);

    $response->assertRedirect(route('admin.pages.edit', $page));

    $section->refresh();
    expect($section->content['image_path'])->not->toBeNull();
    Storage::disk('public')->assertExists($section->content['image_path']);
});

test('replacing a section image deletes the old file', function () {
    Storage::fake('public');
    Storage::disk('public')->put('pages/old.jpg', 'fake-bytes');

    $page = Page::factory()->create();
    $section = PageSection::factory()->for($page)->create([
        'content' => heroPayload(['image_path' => 'pages/old.jpg']),
    ]);

    $this->actingAs($this->admin)->put(route('admin.pages.update', $page), [
        'title' => $page->title,
        'meta_description' => $page->meta_description,
        'is_published' => true,
        'sections' => [[
            'id' => $section->id,
            'is_visible' => true,
            'position' => 0,
            'content' => heroPayload(['image' => fakeImageFile('new.jpg')]),
        ]],
    ]);

    $section->refresh();
    Storage::disk('public')->assertMissing('pages/old.jpg');
    Storage::disk('public')->assertExists($section->content['image_path']);
    expect($section->content['image_path'])->not->toBe('pages/old.jpg');
});

test('an admin can explicitly clear a section image', function () {
    Storage::fake('public');
    Storage::disk('public')->put('pages/old.jpg', 'fake-bytes');

    $page = Page::factory()->create();
    $section = PageSection::factory()->for($page)->create([
        'content' => heroPayload(['image_path' => 'pages/old.jpg']),
    ]);

    $this->actingAs($this->admin)->put(route('admin.pages.update', $page), [
        'title' => $page->title,
        'meta_description' => $page->meta_description,
        'is_published' => true,
        'sections' => [[
            'id' => $section->id,
            'is_visible' => true,
            'position' => 0,
            'content' => heroPayload(['image_path' => null]),
        ]],
    ]);

    $section->refresh();
    Storage::disk('public')->assertMissing('pages/old.jpg');
    expect($section->content['image_path'])->toBeNull();
});

test('an admin can upload a feature_showcase items image', function () {
    Storage::fake('public');

    $page = Page::factory()->create();
    $section = PageSection::factory()->for($page)->featureShowcase()->create();

    $this->actingAs($this->admin)->put(route('admin.pages.update', $page), [
        'title' => $page->title,
        'meta_description' => $page->meta_description,
        'is_published' => true,
        'sections' => [[
            'id' => $section->id,
            'is_visible' => true,
            'position' => 0,
            'content' => [
                'heading' => $section->content['heading'],
                'subheading' => $section->content['subheading'],
                'items' => [
                    [
                        'title' => $section->content['items'][0]['title'],
                        'body' => $section->content['items'][0]['body'],
                        'image' => fakeImageFile('feature.jpg'),
                    ],
                    $section->content['items'][1],
                ],
            ],
        ]],
    ]);

    $section->refresh();
    expect($section->content['items'][0]['image_path'])->not->toBeNull();
    Storage::disk('public')->assertExists($section->content['items'][0]['image_path']);
});

test('editing an unrelated field preserves an existing section image', function () {
    Storage::fake('public');
    Storage::disk('public')->put('pages/existing.jpg', 'fake-bytes');

    $page = Page::factory()->create();
    $section = PageSection::factory()->for($page)->create([
        'content' => heroPayload(['image_path' => 'pages/existing.jpg']),
    ]);

    $this->actingAs($this->admin)->put(route('admin.pages.update', $page), [
        'title' => $page->title,
        'meta_description' => $page->meta_description,
        'is_published' => true,
        'sections' => [[
            'id' => $section->id,
            'is_visible' => true,
            'position' => 0,
            'content' => heroPayload(['heading' => 'Updated Heading', 'image_path' => 'pages/existing.jpg']),
        ]],
    ]);

    $section->refresh();
    expect($section->content['heading'])->toBe('Updated Heading');
    expect($section->content['image_path'])->toBe('pages/existing.jpg');
    Storage::disk('public')->assertExists('pages/existing.jpg');
});

test('clearing a section image via a real multipart submission deletes the old file', function () {
    // The admin editor always submits via Inertia's forceFormData, which
    // serializes a JS `null` as the empty string '' (browsers cannot send a
    // literal null over multipart/form-data). Pest's put() with a plain
    // array bypasses that serialization entirely, so it cannot catch a
    // regression here — this test sends '' directly to match what the
    // browser actually puts on the wire.
    Storage::fake('public');
    Storage::disk('public')->put('pages/old.jpg', 'fake-bytes');

    $page = Page::factory()->create();
    $section = PageSection::factory()->for($page)->create([
        'content' => heroPayload(['image_path' => 'pages/old.jpg']),
    ]);

    $this->actingAs($this->admin)->put(route('admin.pages.update', $page), [
        'title' => $page->title,
        'meta_description' => $page->meta_description,
        'is_published' => true,
        'sections' => [[
            'id' => $section->id,
            'is_visible' => true,
            'position' => 0,
            'content' => heroPayload(['image_path' => '']),
        ]],
    ]);

    $section->refresh();
    Storage::disk('public')->assertMissing('pages/old.jpg');
    expect($section->content['image_path'])->toBeNull();
});

test('a user without access cannot update a page', function () {
    $user = User::factory()->create();

    $page = Page::factory()->create();
    $section = PageSection::factory()->for($page)->create();

    $response = $this->actingAs($user)->put(route('admin.pages.update', $page), [
        'title' => $page->title,
        'meta_description' => $page->meta_description,
        'is_published' => true,
        'sections' => [[
            'id' => $section->id,
            'is_visible' => true,
            'position' => 0,
            'content' => heroPayload(),
        ]],
    ]);

    $response->assertForbidden();
});
