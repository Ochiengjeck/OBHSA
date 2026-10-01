<?php

namespace App\Http\Controllers;

use App\Models\Page;
use App\Models\Service;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    /**
     * List all active services.
     */
    public function index(): Response
    {
        $page = Page::query()
            ->where('slug', 'services')
            ->with(['sections' => fn ($query) => $query->where('is_visible', true)])
            ->first();

        return Inertia::render('public/services/index', [
            'page' => $page,
            'sections' => $page instanceof Page ? $page->sections : [],
            'services' => Service::query()->where('is_active', true)->orderBy('position')->get(),
        ]);
    }

    /**
     * Show a single service.
     */
    public function show(Service $service): Response
    {
        return Inertia::render('public/services/show', [
            'service' => $service,
        ]);
    }
}
