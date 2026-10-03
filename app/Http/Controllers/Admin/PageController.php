<?php

namespace App\Http\Controllers\Admin;

use App\Concerns\StoresUploadedFiles;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdatePageRequest;
use App\Models\Page;
use App\Models\PageSection;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    use StoresUploadedFiles;

    /**
     * List the fixed set of site pages.
     */
    public function index(): Response
    {
        return Inertia::render('admin/pages/index', [
            'pages' => Page::query()->orderBy('title')->get(),
        ]);
    }

    /**
     * Edit a page's sections.
     */
    public function edit(Page $page): Response
    {
        return Inertia::render('admin/pages/edit', [
            'page' => $page,
            'sections' => $page->sections,
        ]);
    }

    /**
     * Update a page's metadata and sections.
     */
    public function update(UpdatePageRequest $request, Page $page): RedirectResponse
    {
        $page->fill($request->safe()->only(['title', 'meta_description', 'is_published']))->save();

        foreach ($request->validated('sections') as $index => $section) {
            $pageSection = PageSection::query()
                ->where('page_id', $page->id)
                ->whereKey($section['id'])
                ->firstOrFail();

            // Laravel's validated() excludes any array key that has no rule
            // of its own once a sibling rule exists for one of its children
            // (here, the file-upload rules below) — so the full content
            // blob is read from raw input instead, exactly as trusted
            // before file support was added. The uploaded files themselves
            // are still fully validated; only *this* read path changed.
            $content = $request->input("sections.{$index}.content", []);

            $pageSection->update([
                'is_visible' => $section['is_visible'],
                'position' => $section['position'],
                'content' => $this->processSectionImages($content, $index, $request, $pageSection->content),
            ]);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Page updated.')]);

        return to_route('admin.pages.edit', $page);
    }

    /**
     * Resolve any uploaded images within a section's content, storing new
     * files, deleting replaced/removed files, and preserving untouched
     * paths. Handles both a top-level image (hero/cta background) and
     * repeatable item images (feature_showcase.items / gallery.images).
     *
     * @param  array<string, mixed>  $content
     * @param  array<string, mixed>  $previousContent
     * @return array<string, mixed>
     */
    private function processSectionImages(array $content, int $index, Request $request, array $previousContent): array
    {
        if ($file = $request->file("sections.{$index}.content.image")) {
            if (! empty($previousContent['image_path'])) {
                Storage::disk('public')->delete($previousContent['image_path']);
            }

            $content['image_path'] = $this->storePublicFile($file, 'pages');
        } elseif (empty($content['image_path'])) {
            // The frontend only ever puts a real path string or null into
            // image_path. Because the admin editor always submits via
            // FormData (forceFormData: true), Inertia serializes that null
            // as '' on the wire (browsers cannot send a literal null) — so
            // an empty value here reliably means "no image should remain",
            // whether that's because one was never set or was just cleared.
            if (! empty($previousContent['image_path'])) {
                Storage::disk('public')->delete($previousContent['image_path']);
            }

            $content['image_path'] = null;
        }
        unset($content['image']);

        foreach (['items', 'images'] as $arrayKey) {
            if (empty($content[$arrayKey]) || ! is_array($content[$arrayKey])) {
                continue;
            }

            foreach ($content[$arrayKey] as $itemIndex => &$item) {
                $previousItem = $previousContent[$arrayKey][$itemIndex] ?? [];

                if ($file = $request->file("sections.{$index}.content.{$arrayKey}.{$itemIndex}.image")) {
                    if (! empty($previousItem['image_path'])) {
                        Storage::disk('public')->delete($previousItem['image_path']);
                    }

                    $item['image_path'] = $this->storePublicFile($file, 'pages');
                } elseif (empty($item['image_path'])) {
                    if (! empty($previousItem['image_path'])) {
                        Storage::disk('public')->delete($previousItem['image_path']);
                    }

                    $item['image_path'] = null;
                }

                unset($item['image']);
            }
            unset($item);
        }

        return $content;
    }
}
