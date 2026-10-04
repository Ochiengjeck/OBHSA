<?php

namespace App\Http\Controllers\Admin;

use App\Concerns\StoresUploadedFiles;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreServiceRequest;
use App\Http\Requests\Admin\UpdateServiceRequest;
use App\Models\Service;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    use StoresUploadedFiles;

    /**
     * List all services.
     */
    public function index(Request $request): Response
    {
        $services = Service::query()
            ->when($request->string('search')->isNotEmpty(), fn ($query) => $query->where('title', 'like', '%'.$request->string('search').'%'))
            ->orderBy('position')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('admin/services/index', [
            'services' => $services,
            'filters' => ['search' => $request->string('search')->value() ?: null],
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
        $service = Service::query()->create($request->safe()->except(['image', 'icon_image', 'icon_path']));

        $service->icon_path = $this->resolveReplaceablePath(
            $request->file('icon_image'),
            $request->input('icon_path'),
            null,
            'service-icons',
        );

        if ($request->hasFile('image')) {
            $service->image_path = $this->storePublicFile($request->file('image'), 'services');
        }

        $service->save();

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
        $previousIconPath = $service->icon_path;

        $service->fill($request->safe()->except(['image', 'icon_image', 'icon_path']));

        $service->icon_path = $this->resolveReplaceablePath(
            $request->file('icon_image'),
            $request->input('icon_path'),
            $previousIconPath,
            'service-icons',
        );

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

        if ($service->icon_path) {
            Storage::disk('public')->delete($service->icon_path);
        }

        $service->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Service deleted.')]);

        return to_route('admin.services.index');
    }
}
