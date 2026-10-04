<?php

namespace App\Http\Middleware;

use App\Enums\ApplicationStatus;
use App\Models\Application;
use App\Models\Credential;
use App\Models\SiteSetting;
use App\Models\StaffingRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $user,
                'roles' => $user?->getRoleNames() ?? [],
                'permissions' => $user?->getAllPermissions()->pluck('name') ?? [],
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'siteSettings' => SiteSetting::allCached(),
            // The public disk's resolved URL root — local disk in dev
            // (`APP_URL/storage`), the real bucket URL once production
            // switches FILESYSTEM_PUBLIC_DRIVER to s3/r2. Every uploaded
            // image path is joined onto this rather than a hardcoded
            // "/storage" prefix, so rendering keeps working either way.
            'storageUrl' => rtrim((string) config('filesystems.disks.public.url'), '/'),
            'adminNavBadges' => $this->adminNavBadges($user),
        ];
    }

    /**
     * "Needs attention now" counts for the admin sidebar's badged nav items.
     * Only computed for admin/editor users, and briefly cached since the
     * sidebar renders on every admin page navigation.
     *
     * @return array<string, int>|null
     */
    private function adminNavBadges(?User $user): ?array
    {
        if (! $user?->hasAnyRole(['admin', 'editor'])) {
            return null;
        }

        return Cache::remember('admin-nav-badges', 60, fn () => [
            'applications' => Application::query()->where('status', ApplicationStatus::Submitted->value)->count(),
            'staffingRequests' => StaffingRequest::query()->where('status', 'new')->count(),
            'compliance' => Credential::query()
                ->whereNotNull('expiry_date')
                ->whereHas('candidate.employee', fn ($query) => $query->where('status', 'active'))
                ->where('expiry_date', '<=', now()->addDays(30))
                ->count(),
        ]);
    }
}
