<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreFacilityRequest;
use App\Http\Requests\Admin\UpdateFacilityRequest;
use App\Models\Facility;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FacilityController extends Controller
{
    /**
     * List all facilities.
     */
    public function index(Request $request): Response
    {
        $facilities = Facility::query()
            ->withCount('shifts')
            ->when($request->string('search')->isNotEmpty(), fn ($query) => $query->where('name', 'like', '%'.$request->string('search').'%'))
            ->orderBy('name')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('admin/facilities/index', [
            'facilities' => $facilities,
            'filters' => ['search' => $request->string('search')->value() ?: null],
        ]);
    }

    /**
     * Show the form to create a new facility.
     */
    public function create(): Response
    {
        return Inertia::render('admin/facilities/create');
    }

    /**
     * Store a new facility.
     */
    public function store(StoreFacilityRequest $request): RedirectResponse
    {
        Facility::query()->create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Facility created.')]);

        return to_route('admin.facilities.index');
    }

    /**
     * Show the form to edit a facility.
     */
    public function edit(Facility $facility): Response
    {
        return Inertia::render('admin/facilities/edit', [
            'facility' => $facility,
        ]);
    }

    /**
     * Update a facility.
     */
    public function update(UpdateFacilityRequest $request, Facility $facility): RedirectResponse
    {
        $facility->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Facility updated.')]);

        return to_route('admin.facilities.index');
    }

    /**
     * Delete a facility.
     */
    public function destroy(Facility $facility): RedirectResponse
    {
        $facility->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Facility deleted.')]);

        return to_route('admin.facilities.index');
    }
}
