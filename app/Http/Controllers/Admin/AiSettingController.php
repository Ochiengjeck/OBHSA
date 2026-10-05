<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateAiSettingsRequest;
use App\Models\AiSetting;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;

class AiSettingController extends Controller
{
    /**
     * Show the AI configuration editor: active provider, whether each
     * provider's key is coming from .env or a custom override (never the
     * key itself), and every permission the AI can be granted (the same
     * full list a Role's permission matrix uses) alongside which ones it
     * currently holds.
     */
    public function index(): Response
    {
        $setting = AiSetting::current();

        return Inertia::render('admin/ai-settings/index', [
            'provider' => $setting->provider,
            'keyOverrides' => [
                'claude' => $setting->claude_api_key !== null,
                'gemini' => $setting->gemini_api_key !== null,
                'xai' => $setting->xai_api_key !== null,
            ],
            'permissions' => Permission::query()->orderBy('name')->get(['id', 'name']),
            'grantedPermissions' => $setting->permissions()->pluck('name'),
        ]);
    }

    /**
     * Update the active provider, per-provider key overrides (a blank
     * field reverts that provider to its .env key), and which permissions
     * the AI itself currently holds.
     */
    public function update(UpdateAiSettingsRequest $request): RedirectResponse
    {
        $setting = AiSetting::current();

        $setting->update([
            'provider' => $request->validated('provider'),
            'claude_api_key' => $request->validated('claude_api_key') ?: null,
            'gemini_api_key' => $request->validated('gemini_api_key') ?: null,
            'xai_api_key' => $request->validated('xai_api_key') ?: null,
        ]);
        $setting->syncPermissions($request->validated('permissions', []));

        Inertia::flash('toast', ['type' => 'success', 'message' => __('AI settings updated.')]);

        return to_route('admin.ai-settings.index');
    }
}
