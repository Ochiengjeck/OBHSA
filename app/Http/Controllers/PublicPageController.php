<?php

namespace App\Http\Controllers;

use App\Models\Page;
use App\Models\Service;
use App\Models\Stat;
use App\Models\Testimonial;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicPageController extends Controller
{
    /**
     * Show the home page.
     */
    public function home(): Response
    {
        return $this->renderPage('home', 'welcome');
    }

    /**
     * Show a CMS-driven marketing page by slug.
     */
    public function show(Request $request): Response
    {
        return $this->renderPage($request->route('slug'), 'public/'.$request->route('slug'));
    }

    private function renderPage(string $slug, string $component): Response
    {
        $page = Page::query()
            ->where('slug', $slug)
            ->where('is_published', true)
            ->with(['sections' => fn ($query) => $query->where('is_visible', true)])
            ->firstOrFail();

        return Inertia::render($component, [
            'page' => $page,
            'sections' => $page->sections,
            'services' => fn () => Service::query()->where('is_active', true)->orderBy('position')->get(),
            'testimonials' => fn () => Testimonial::query()->where('is_featured', true)->orderBy('position')->get(),
            'stats' => fn () => Stat::query()->where('is_active', true)->orderBy('position')->get(),
        ]);
    }
}
