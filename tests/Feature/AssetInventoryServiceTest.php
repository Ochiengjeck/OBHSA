<?php

use App\Models\BlogPost;
use App\Models\Candidate;
use App\Models\Document;
use App\Models\JobListing;
use App\Models\Page;
use App\Models\PageSection;
use App\Models\Service;
use App\Models\SiteSetting;
use App\Models\Stat;
use App\Models\Testimonial;
use App\Services\AssetInventoryService;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('public');
    $this->service = app(AssetInventoryService::class);
});

function putAsset(string $path): void
{
    Storage::disk('public')->put($path, 'fake-bytes');
}

test('a file referenced by a Service column is in use', function () {
    putAsset('service-icons/icon.png');
    putAsset('services/image.png');
    $service = Service::factory()->create(['icon_path' => 'service-icons/icon.png', 'image_path' => 'services/image.png']);

    $used = $this->service->usedPaths();

    expect($used)->toHaveKey('service-icons/icon.png');
    expect($used['service-icons/icon.png'])->toContain($service->title);
    expect($used)->toHaveKey('services/image.png');
});

test('a file referenced by a JobListing is in use', function () {
    putAsset('job-listings/image.png');
    $listing = JobListing::factory()->create(['image_path' => 'job-listings/image.png']);

    $used = $this->service->usedPaths();

    expect($used['job-listings/image.png'])->toContain($listing->title);
});

test('a file referenced by a BlogPost is in use', function () {
    putAsset('blog/image.png');
    $post = BlogPost::factory()->create(['featured_image_path' => 'blog/image.png']);

    $used = $this->service->usedPaths();

    expect($used['blog/image.png'])->toContain($post->title);
});

test('a file referenced by a Testimonial is in use', function () {
    putAsset('testimonials/photo.png');
    $testimonial = Testimonial::factory()->create(['author_photo_path' => 'testimonials/photo.png']);

    $used = $this->service->usedPaths();

    expect($used['testimonials/photo.png'])->toContain($testimonial->author_name);
});

test('a file referenced by a Stat is in use', function () {
    putAsset('stat-icons/icon.png');
    $stat = Stat::factory()->create(['icon_path' => 'stat-icons/icon.png']);

    $used = $this->service->usedPaths();

    expect($used['stat-icons/icon.png'])->toContain($stat->label);
});

test('the site logo is in use', function () {
    putAsset('branding/logo.png');
    SiteSetting::set('logo_path', 'branding/logo.png');

    $used = $this->service->usedPaths();

    expect($used)->toHaveKey('branding/logo.png');
});

test('a top-level PageSection image is in use', function () {
    putAsset('pages/hero.png');
    $page = Page::factory()->create();
    PageSection::factory()->for($page)->create([
        'content' => ['heading' => 'Hi', 'image_path' => 'pages/hero.png'],
    ]);

    $used = $this->service->usedPaths();

    expect($used)->toHaveKey('pages/hero.png');
});

test('an image nested in PageSection content.items is in use', function () {
    putAsset('pages/item-1.png');
    $page = Page::factory()->create();
    PageSection::factory()->for($page)->featureShowcase()->create([
        'content' => [
            'heading' => 'Features',
            'items' => [
                ['title' => 'One', 'body' => 'x', 'image_path' => 'pages/item-1.png'],
            ],
        ],
    ]);

    $used = $this->service->usedPaths();

    expect($used)->toHaveKey('pages/item-1.png');
});

test('an image nested in PageSection content.images is in use', function () {
    putAsset('pages/gallery-1.png');
    $page = Page::factory()->create();
    PageSection::factory()->for($page)->gallery()->create([
        'content' => [
            'heading' => 'Gallery',
            'images' => [
                ['image_path' => 'pages/gallery-1.png', 'caption' => 'x'],
            ],
        ],
    ]);

    $used = $this->service->usedPaths();

    expect($used)->toHaveKey('pages/gallery-1.png');
});

test('a Document file on the public disk is in use', function () {
    putAsset('resumes/resume.pdf');
    $candidate = Candidate::factory()->create();
    Document::query()->create([
        'candidate_id' => $candidate->id,
        'document_type' => 'resume',
        'disk' => 'public',
        'file_path' => 'resumes/resume.pdf',
        'original_filename' => 'resume.pdf',
        'mime_type' => 'application/pdf',
        'file_size' => 100,
        'uploaded_at' => now(),
    ]);

    $used = $this->service->usedPaths();

    expect($used)->toHaveKey('resumes/resume.pdf');
    expect($used['resumes/resume.pdf'])->toContain($candidate->full_name);
});

test('a file nothing references is classified as legacy', function () {
    putAsset('services/orphan.png');

    $files = $this->service->scan();
    $orphan = $files->firstWhere('path', 'services/orphan.png');

    expect($orphan->status->value)->toBe('legacy');
    expect($orphan->usedBy)->toBeNull();
});

test('a referenced file is classified as in_use with its label in scan results', function () {
    putAsset('stat-icons/icon.png');
    $stat = Stat::factory()->create(['icon_path' => 'stat-icons/icon.png']);

    $files = $this->service->scan();
    $file = $files->firstWhere('path', 'stat-icons/icon.png');

    expect($file->status->value)->toBe('in_use');
    expect($file->usedBy)->toContain($stat->label);
});

test('dotfiles like a directory-tracking .gitignore are never listed as assets', function () {
    putAsset('.gitignore');
    putAsset('branding/.gitignore');
    putAsset('services/real-upload.png');

    $files = $this->service->scan();

    expect($files->pluck('path'))->not->toContain('.gitignore', 'branding/.gitignore');
    expect($files->pluck('path'))->toContain('services/real-upload.png');
});

test('isInUse reflects the same classification as usedPaths', function () {
    putAsset('stat-icons/icon.png');
    putAsset('services/orphan.png');
    Stat::factory()->create(['icon_path' => 'stat-icons/icon.png']);

    expect($this->service->isInUse('stat-icons/icon.png'))->toBeTrue();
    expect($this->service->isInUse('services/orphan.png'))->toBeFalse();
});
