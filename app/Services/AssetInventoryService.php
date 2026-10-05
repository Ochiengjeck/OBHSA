<?php

namespace App\Services;

use App\Enums\AssetStatus;
use App\Models\BlogPost;
use App\Models\Document;
use App\Models\JobListing;
use App\Models\PageSection;
use App\Models\Service;
use App\Models\SiteSetting;
use App\Models\Stat;
use App\Models\Testimonial;
use App\Services\AssetInventory\AssetFile;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;
use League\Flysystem\FileAttributes;

/**
 * Enumerates every file on the public disk and classifies each as in-use
 * (referenced by a live record) or legacy, against the one, single-source
 * map of "where every uploaded file path can be referenced from" — also
 * reused as-is by the delete endpoint's own re-verification, so there is
 * never a second copy of this logic that could drift out of sync.
 */
class AssetInventoryService
{
    private const array IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'];

    /**
     * @return Collection<int, AssetFile>
     */
    public function scan(): Collection
    {
        $usedPaths = $this->usedPaths();

        /** @var FilesystemAdapter $disk */
        $disk = Storage::disk('public');

        /** @var list<AssetFile> $files */
        $files = [];

        foreach ($disk->getDriver()->listContents('', true) as $attributes) {
            if (! $attributes->isFile()) {
                continue;
            }

            $path = $attributes->path();

            // Repo-management files (e.g. the .gitignore that keeps an
            // otherwise-empty upload directory tracked in git) aren't
            // uploads and must never be offered up for deletion here.
            if (str_starts_with(basename($path), '.')) {
                continue;
            }
            $usedBy = $usedPaths[$path] ?? null;

            $files[] = new AssetFile(
                path: $path,
                size: $attributes instanceof FileAttributes ? (int) $attributes->fileSize() : 0,
                lastModifiedAt: Carbon::createFromTimestamp($attributes->lastModified() ?? time()),
                status: $usedBy !== null ? AssetStatus::InUse : AssetStatus::Legacy,
                usedBy: $usedBy,
                isImage: in_array(strtolower(pathinfo($path, PATHINFO_EXTENSION)), self::IMAGE_EXTENSIONS, true),
            );
        }

        return collect($files);
    }

    /**
     * Every path currently referenced by a live record, mapped to a short
     * human label describing what it's used by. Built fresh every call —
     * cheap (8 single-table queries, no joins) and must never be cached
     * across a delete, since a stale "in use" map is exactly what would
     * let an actually-orphaned file survive, and a stale "free" map is
     * exactly what could let an in-use file be deleted.
     *
     * @return array<string, string>
     */
    public function usedPaths(): array
    {
        $used = [];

        foreach (Service::query()->get(['id', 'title', 'icon_path', 'image_path']) as $service) {
            if ($service->icon_path) {
                $used[$service->icon_path] = "Service: {$service->title} (icon)";
            }
            if ($service->image_path) {
                $used[$service->image_path] = "Service: {$service->title} (image)";
            }
        }

        foreach (JobListing::query()->whereNotNull('image_path')->get(['id', 'title', 'image_path']) as $listing) {
            $used[$listing->image_path] = "Job Listing: {$listing->title}";
        }

        foreach (BlogPost::query()->whereNotNull('featured_image_path')->get(['id', 'title', 'featured_image_path']) as $post) {
            $used[$post->featured_image_path] = "Blog Post: {$post->title}";
        }

        foreach (Testimonial::query()->whereNotNull('author_photo_path')->get(['id', 'author_name', 'author_photo_path']) as $testimonial) {
            $used[$testimonial->author_photo_path] = "Testimonial: {$testimonial->author_name}";
        }

        foreach (Stat::query()->whereNotNull('icon_path')->get(['id', 'label', 'icon_path']) as $stat) {
            $used[$stat->icon_path] = "Stat: {$stat->label}";
        }

        $logoPath = SiteSetting::query()->where('key', 'logo_path')->value('value');
        if ($logoPath) {
            $used[$logoPath] = 'Site Settings: Logo';
        }

        foreach (PageSection::query()->with('page:id,title')->get(['id', 'page_id', 'type', 'content']) as $section) {
            $content = $section->content ?? [];
            $page = $section->page;
            $label = 'Page: '.($page === null ? '—' : $page->title)." — {$section->type} section";

            if (! empty($content['image_path'])) {
                $used[$content['image_path']] = $label;
            }

            foreach (['items', 'images'] as $key) {
                foreach ($content[$key] ?? [] as $index => $item) {
                    if (! empty($item['image_path'])) {
                        $used[$item['image_path']] = $label.' #'.($index + 1);
                    }
                }
            }
        }

        foreach (Document::query()->where('disk', 'public')->whereNotNull('file_path')->with('candidate:id,full_name')->get(['id', 'candidate_id', 'document_type', 'file_path']) as $document) {
            $candidate = $document->candidate;
            $used[$document->file_path] = ucfirst(str_replace('_', ' ', $document->document_type)).': '.($candidate === null ? 'Unknown candidate' : $candidate->full_name);
        }

        return $used;
    }

    /**
     * Delete-time re-check — reuses the exact same map scan() builds,
     * never a parallel implementation that could disagree with it.
     *
     * @param  array<string, string>|null  $usedPaths
     */
    public function isInUse(string $path, ?array $usedPaths = null): bool
    {
        return array_key_exists($path, $usedPaths ?? $this->usedPaths());
    }
}
