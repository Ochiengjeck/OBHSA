<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreStatRequest;
use App\Http\Requests\Admin\UpdateStatRequest;
use App\Models\Stat;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class StatController extends Controller
{
    /**
     * List all stats.
     */
    public function index(): Response
    {
        return Inertia::render('admin/stats/index', [
            'stats' => Stat::query()->orderBy('position')->get(),
        ]);
    }

    /**
     * Show the form to create a new stat.
     */
    public function create(): Response
    {
        return Inertia::render('admin/stats/create');
    }

    /**
     * Store a new stat.
     */
    public function store(StoreStatRequest $request): RedirectResponse
    {
        Stat::query()->create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Stat created.')]);

        return to_route('admin.stats.index');
    }

    /**
     * Show the form to edit a stat.
     */
    public function edit(Stat $stat): Response
    {
        return Inertia::render('admin/stats/edit', [
            'stat' => $stat,
        ]);
    }

    /**
     * Update a stat.
     */
    public function update(UpdateStatRequest $request, Stat $stat): RedirectResponse
    {
        $stat->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Stat updated.')]);

        return to_route('admin.stats.index');
    }

    /**
     * Delete a stat.
     */
    public function destroy(Stat $stat): RedirectResponse
    {
        $stat->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Stat deleted.')]);

        return to_route('admin.stats.index');
    }
}
