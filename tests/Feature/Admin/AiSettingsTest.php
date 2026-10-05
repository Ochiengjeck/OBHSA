<?php

use App\Models\AiSetting;
use App\Models\User;
use App\Services\Ai\AiProviderFactory;
use App\Services\Copilot\ToolRegistry;
use App\Services\Copilot\Tools\GetCandidateDossierTool;
use Database\Seeders\RoleSeeder;
use Illuminate\Support\Facades\Http;
use Spatie\Permission\Models\Permission;

beforeEach(function () {
    $this->seed(RoleSeeder::class);
    $this->admin = User::factory()->create();
    $this->admin->assignRole('admin');
    $this->editor = User::factory()->create();
    $this->editor->assignRole('editor');

    config([
        'ai.provider' => 'claude',
        'ai.providers.claude.api_key' => 'env-claude-key',
        'ai.providers.gemini.api_key' => 'env-gemini-key',
    ]);
});

test('an admin can view and update AI settings', function () {
    $this->actingAs($this->admin)->get(route('admin.ai-settings.index'))->assertOk();

    $response = $this->actingAs($this->admin)->put(route('admin.ai-settings.update'), [
        'provider' => 'gemini',
        'claude_api_key' => '',
        'gemini_api_key' => 'custom-gemini-key',
        'xai_api_key' => '',
        'permissions' => ['applications.view', 'applications.update'],
    ]);

    $response->assertRedirect(route('admin.ai-settings.index'));

    $setting = AiSetting::current();
    expect($setting->provider)->toBe('gemini');
    expect($setting->gemini_api_key)->toBe('custom-gemini-key');
    expect($setting->claude_api_key)->toBeNull();
    expect($setting->permissions()->pluck('name')->sort()->values()->all())
        ->toBe(['applications.update', 'applications.view']);
});

test('an editor cannot view or update AI settings', function () {
    $this->actingAs($this->editor)->get(route('admin.ai-settings.index'))->assertForbidden();

    $this->actingAs($this->editor)->put(route('admin.ai-settings.update'), [
        'permissions' => [],
    ])->assertForbidden();
});

test('a DB-stored API key override takes precedence over the env key', function () {
    AiSetting::current()->update(['gemini_api_key' => 'custom-gemini-key']);

    Http::fake(['generativelanguage.googleapis.com/*' => Http::response([
        'candidates' => [['content' => ['parts' => [['text' => 'hi']]]]],
    ])]);

    AiProviderFactory::make('gemini')->chat([], []);

    Http::assertSent(fn ($request) => $request->hasHeader('x-goog-api-key', 'custom-gemini-key'));
});

test('a DB-stored provider override takes precedence over the configured default', function () {
    AiSetting::current()->update(['provider' => 'gemini']);

    expect(AiProviderFactory::resolveProviderName())->toBe('gemini');
});

test('a fresh AiSetting with no granted permissions is unrestricted', function () {
    $setting = AiSetting::current();

    expect($setting->hasGrantedPermission('applications.view'))->toBeTrue();
    expect($setting->hasGrantedPermission('users.view'))->toBeTrue();
    expect($setting->hasGrantedPermission(null))->toBeTrue();
});

test('granting the AI any permission makes it exactly that restricted set', function () {
    $setting = AiSetting::current();
    $setting->givePermissionTo(Permission::findOrCreate('applications.view'));

    expect($setting->hasGrantedPermission('applications.view'))->toBeTrue();
    expect($setting->hasGrantedPermission('applications.update'))->toBeFalse();
    expect($setting->hasGrantedPermission('users.view'))->toBeFalse();
});

test('disabling a tool rejects it in the tool registry but a dynamically-scoped tool stays visible', function () {
    $setting = AiSetting::current();
    $setting->givePermissionTo(Permission::findOrCreate('applications.view'));

    $registry = app(ToolRegistry::class);
    $names = $registry->all()->map(fn ($tool) => $tool->name())->all();

    expect($names)->toContain('search_candidates', 'get_candidate_dossier', 'list_applications');
    expect($names)->toContain('list_records', 'get_record', 'update_record', 'search_policy_docs');
    expect($names)->not->toContain('assign_recruiter', 'send_candidate_message', 'applications_summary');
});

test('the AI-grant check is independent from the acting user\'s own permission', function () {
    $setting = AiSetting::current();
    $setting->givePermissionTo(Permission::findOrCreate('applications.view'));

    $tool = new GetCandidateDossierTool;

    expect($tool->authorize($this->admin, []))->toBeTrue();
    expect($setting->hasGrantedPermission($tool->requiredPermission([])))->toBeTrue();

    expect($tool->authorize($this->editor, []))->toBeFalse();
});
