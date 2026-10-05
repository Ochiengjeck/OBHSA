<?php

namespace App\Http\Controllers\Admin;

use App\Concerns\StoresUploadedFiles;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreStatRequest;
use App\Http\Requests\Admin\UpdateStatRequest;
use App\Models\Stat;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class StatController extends Controller
{
    use StoresUploadedFiles;

    /**
     * List all stats.
     */
    public function index(Request $request): Response
    {
        $stats = Stat::query()
            ->when($request->string('search')->isNotEmpty(), fn ($query) => $query->where('label', 'like', '%'.$request->string('search').'%'))
            ->orderBy('position')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('admin/stats/index', [
            'stats' => $stats,
            'filters' => ['search' => $request->string('search')->value() ?: null],
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
        $stat = Stat::query()->create($request->safe()->except(['icon_image', 'icon_path']));

        $stat->update([
            'icon_path' => $this->resolveReplaceablePath(
                $request->file('icon_image'),
                $request->input('icon_path'),
                null,
                'stat-icons',
            ),
        ]);

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
        $iconPath = $this->resolveReplaceablePath(
            $request->file('icon_image'),
            $request->input('icon_path'),
            $stat->icon_path,
            'stat-icons',
        );

        $stat->update([...$request->safe()->except(['icon_image', 'icon_path']), 'icon_path' => $iconPath]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Stat updated.')]);

        return to_route('admin.stats.index');
    }

    /**
     * Delete a stat.
     */
    public function destroy(Stat $stat): RedirectResponse
    {
        if ($stat->icon_path) {
            Storage::disk('public')->delete($stat->icon_path);
        }

        $stat->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Stat deleted.')]);

        return to_route('admin.stats.index');
    }
}
