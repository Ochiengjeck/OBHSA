<?php

namespace App\Http\Controllers\Admin;

use App\Concerns\StoresUploadedFiles;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreServiceRequest;
use App\Http\Requests\Admin\UpdateServiceRequest;
use App\Models\Service;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    use StoresUploadedFiles;

    /**
     * List all services.
     */
    public function index(): Response
    {
        return Inertia::render('admin/services/index', [
            'services' => Service::query()->orderBy('position')->get(),
        ]);
    }

    /**
     * Show the form to create a new service.
     */
    public function create(): Response
    {
        return Inertia::render('admin/services/create');
    }

    /**
     * Store a new service.
     */
    public function store(StoreServiceRequest $request): RedirectResponse
    {
        $service = Service::query()->create($request->safe()->except('image'));

        if ($request->hasFile('image')) {
            $service->update(['image_path' => $this->storePublicFile($request->file('image'), 'services')]);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Service created.')]);

        return to_route('admin.services.index');
    }

    /**
     * Show the form to edit a service.
     */
    public function edit(Service $service): Response
    {
        return Inertia::render('admin/services/edit', [
            'service' => $service,
        ]);
    }

    /**
     * Update a service.
     */
    public function update(UpdateServiceRequest $request, Service $service): RedirectResponse
    {
        $service->fill($request->safe()->except('image'));

        if ($request->hasFile('image')) {
            if ($service->image_path) {
                Storage::disk('public')->delete($service->image_path);
            }

            $service->image_path = $this->storePublicFile($request->file('image'), 'services');
        }

        $service->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Service updated.')]);

        return to_route('admin.services.index');
    }

    /**
     * Delete a service.
     */
    public function destroy(Service $service): RedirectResponse
    {
        if ($service->image_path) {
            Storage::disk('public')->delete($service->image_path);
        }

        $service->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Service deleted.')]);

        return to_route('admin.services.index');
    }
}
