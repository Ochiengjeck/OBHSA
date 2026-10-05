<?php

namespace App\Http\Controllers\Admin;

use App\Enums\AssetStatus;
use App\Enums\AssetType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\DeleteAssetsRequest;
use App\Services\AssetInventory\AssetFile;
use App\Services\AssetInventoryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AssetController extends Controller
{
    private const int PER_PAGE = 25;

    /**
     * List every uploaded file on the public disk, classified as in-use
     * or legacy, optionally filtered by status, type, and a path/used-by
     * text search.
     */
    public function index(Request $request, AssetInventoryService $assets): Response
    {
        $status = $request->string('status')->value() ?: null;
        $type = $request->string('type')->value() ?: null;
        $search = $request->string('search')->value() ?: null;

        $files = $assets->scan();

        $counts = [
            'total' => $files->count(),
            'in_use' => $files->where('status', AssetStatus::InUse)->count(),
            'legacy' => $files->where('status', AssetStatus::Legacy)->count(),
            'by_type' => collect(AssetType::cases())->mapWithKeys(
                fn (AssetType $case) => [$case->value => $files->where('type', $case)->count()],
            )->all(),
        ];

        $filtered = $files
            ->when($status !== null, fn ($items) => $items->filter(fn (AssetFile $file) => $file->status->value === $status))
            ->when($type !== null, fn ($items) => $items->filter(fn (AssetFile $file) => $file->type->value === $type))
            ->when($search !== null, fn ($items) => $items->filter(
                fn (AssetFile $file) => str_contains(strtolower($file->path), strtolower($search))
                    || str_contains(strtolower($file->usedBy ?? ''), strtolower($search)),
            ))
            ->values();

        $page = $request->integer('page', 1);

        $paginator = new LengthAwarePaginator(
            $filtered->forPage($page, self::PER_PAGE)->values(),
            $filtered->count(),
            self::PER_PAGE,
            $page,
            ['path' => $request->url(), 'query' => $request->query()],
        );

        return Inertia::render('admin/assets/index', [
            'assets' => $paginator,
            'counts' => $counts,
            'filters' => ['status' => $status, 'type' => $type, 'search' => $search],
        ]);
    }

    /**
     * Delete one or more legacy assets. Every path is re-verified against
     * a freshly built "used paths" map at the moment of deletion — never
     * trusting whatever status the index page last displayed — so an
     * in-use file can never be deleted no matter how stale the page is.
     */
    public function destroy(DeleteAssetsRequest $request, AssetInventoryService $assets): JsonResponse
    {
        $usedPaths = $assets->usedPaths();
        $disk = Storage::disk('public');

        /** @var list<string> $paths */
        $paths = $request->validated('paths');

        $results = collect($paths)->map(function (string $path) use ($assets, $usedPaths, $disk) {
            if (! $disk->exists($path)) {
                return ['path' => $path, 'deleted' => false, 'reason' => 'not_found', 'used_by' => null];
            }

            if ($assets->isInUse($path, $usedPaths)) {
                return ['path' => $path, 'deleted' => false, 'reason' => 'in_use', 'used_by' => $usedPaths[$path]];
            }

            $disk->delete($path);

            return ['path' => $path, 'deleted' => true, 'reason' => null, 'used_by' => null];
        })->values();

        // Always 200: this isn't a validation failure (DeleteAssetsRequest
        // already handles that, and Inertia's useHttp() special-cases 422
        // as a Laravel validation-error response — reading response.errors,
        // not an arbitrary payload, and resolving to undefined rather than
        // the body). A path being refused as in-use is a normal, expected
        // per-item outcome, reported in `results`, not a request failure.
        return response()->json(['results' => $results]);
    }
}
