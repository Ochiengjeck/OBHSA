<?php

namespace App\Http\Controllers;

use App\Models\Page;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    /**
     * Show the contact page.
     */
    public function show(): Response
    {
        $page = Page::query()
            ->where('slug', 'contact')
            ->with(['sections' => fn ($query) => $query->where('is_visible', true)])
            ->firstOrFail();

        return Inertia::render('public/contact', [
            'page' => $page,
            'sections' => $page->sections,
        ]);
    }
}
