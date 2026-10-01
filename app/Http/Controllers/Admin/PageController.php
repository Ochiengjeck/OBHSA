<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdatePageRequest;
use App\Models\Page;
use App\Models\PageSection;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
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

        foreach ($request->validated('sections') as $section) {
            PageSection::query()
                ->where('page_id', $page->id)
                ->whereKey($section['id'])
                ->update([
                    'is_visible' => $section['is_visible'],
                    'position' => $section['position'],
                    'content' => $section['content'],
                ]);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Page updated.')]);

        return to_route('admin.pages.edit', $page);
    }
}
