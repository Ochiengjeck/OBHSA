<?php

namespace App\Http\Controllers\Admin;

use App\Concerns\StoresUploadedFiles;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateSiteSettingsRequest;
use App\Models\SiteSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class SiteSettingController extends Controller
{
    use StoresUploadedFiles;

    /**
     * Show the site settings editor, grouped by section.
     */
    public function index(): Response
    {
        return Inertia::render('admin/site-settings/index', [
            'settings' => SiteSetting::query()->orderBy('group')->orderBy('key')->get(),
        ]);
    }

    /**
     * Update the site settings.
     */
    public function update(UpdateSiteSettingsRequest $request): RedirectResponse
    {
        foreach ($request->validated('settings') as $key => $value) {
            SiteSetting::set($key, $value);
        }

        if ($request->hasFile('logo')) {
            $previous = SiteSetting::get('logo_path');

            if ($previous) {
                Storage::disk('public')->delete($previous);
            }

            SiteSetting::set('logo_path', $this->storePublicFile($request->file('logo'), 'branding'));
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Site settings updated.')]);

        return to_route('admin.site-settings.index');
    }
}
