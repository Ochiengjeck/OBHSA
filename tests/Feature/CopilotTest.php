<?php

use App\Models\Application;
use App\Models\CopilotAction;
use App\Models\PolicyDocument;
use App\Models\User;
use App\Services\Copilot\Tools\AssignRecruiterTool;
use App\Services\Copilot\Tools\GetCandidateDossierTool;
use App\Services\Copilot\Tools\SearchCandidatesTool;
use App\Services\Copilot\Tools\SearchPolicyDocsTool;
use App\Services\Copilot\Tools\SendCandidateMessageTool;
use App\Services\Copilot\Tools\TransitionApplicationStatusTool;
use Database\Seeders\RoleSeeder;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;

beforeEach(function () {
    $this->seed(RoleSeeder::class);
    $this->admin = User::factory()->create();
    $this->admin->assignRole('admin');
    $this->editor = User::factory()->create();
    $this->editor->assignRole('editor');

    config(['ai.provider' => 'claude', 'ai.providers.claude.api_key' => 'test-key']);
});

test('read-only tools never require confirmation and write tools always do', function () {
    expect((new SearchCandidatesTool)->requiresConfirmation())->toBeFalse();
    expect((new GetCandidateDossierTool)->requiresConfirmation())->toBeFalse();
    expect((new SearchPolicyDocsTool)->requiresConfirmation())->toBeFalse();
    expect((new TransitionApplicationStatusTool)->requiresConfirmation())->toBeTrue();
    expect((new AssignRecruiterTool)->requiresConfirmation())->toBeTrue();
    expect((new SendCandidateMessageTool)->requiresConfirmation())->toBeTrue();
});

test('every application-scoped tool inherits the manage-applications permission check', function () {
    $tools = [
        new SearchCandidatesTool,
        new GetCandidateDossierTool,
        new TransitionApplicationStatusTool,
        new AssignRecruiterTool,
        new SendCandidateMessageTool,
    ];

    foreach ($tools as $tool) {
        expect($tool->authorize($this->admin))->toBeTrue();
        expect($tool->authorize($this->editor))->toBeFalse();
    }
});

test('the policy doc search tool returns a snippet from a matching active document', function () {
    PolicyDocument::query()->create([
        'title' => 'PTO Policy',
        'body' => 'Employees accrue paid time off at a rate of one day per month of service.',
        'is_active' => true,
    ]);
    PolicyDocument::query()->create([
        'title' => 'Draft Policy',
        'body' => 'This mentions paid time off too but is not active yet.',
        'is_active' => false,
    ]);

    $results = (new SearchPolicyDocsTool)->execute($this->admin, ['query' => 'paid time off']);

    expect($results['results'])->toHaveCount(1);
    expect($results['results'][0]['title'])->toBe('PTO Policy');
    expect($results['results'][0]['snippet'])->toContain('paid time off');
});

test('a read-only tool call executes immediately through the full chat flow', function () {
    Http::fake(['api.anthropic.com/*' => Http::sequence()
        ->push(['content' => [
            ['type' => 'tool_use', 'id' => 'call_1', 'name' => 'search_candidates', 'input' => ['query' => 'jane']],
        ]])
        ->push(['content' => [['type' => 'text', 'text' => 'No matches found.']]])]);

    $response = $this->actingAs($this->admin)->post(route('admin.copilot.message'), [
        'message' => 'Find candidates named jane',
    ]);

    $response->assertRedirect(route('admin.copilot.index'));

    $action = CopilotAction::query()->where('tool_name', 'search_candidates')->firstOrFail();
    expect($action->status)->toBe('executed');
    expect($action->result)->toHaveKey('candidates');

    $page = $this->actingAs($this->admin)->get(route('admin.copilot.index'));
    $page->assertInertia(fn ($p) => $p->where('pendingAction', null));
});

test('a write tool call stops for confirmation and never executes on its own', function () {
    $application = Application::factory()->create();
    $recruiter = User::factory()->create();

    Http::fake(['api.anthropic.com/*' => Http::response(['content' => [
        ['type' => 'tool_use', 'id' => 'call_1', 'name' => 'assign_recruiter', 'input' => [
            'application_id' => $application->id,
            'recruiter_id' => $recruiter->id,
        ]],
    ]])]);

    $this->actingAs($this->admin)->post(route('admin.copilot.message'), [
        'message' => "Assign recruiter {$recruiter->id} to application {$application->id}",
    ]);

    $action = CopilotAction::query()->where('tool_name', 'assign_recruiter')->firstOrFail();
    expect($action->status)->toBe('pending_confirmation');
    expect($application->fresh()->assigned_recruiter_id)->toBeNull();
});

test('confirming a pending action executes it and lets the copilot react', function () {
    $application = Application::factory()->create();
    $recruiter = User::factory()->create();

    Http::fake(['api.anthropic.com/*' => Http::sequence()
        ->push(['content' => [
            ['type' => 'tool_use', 'id' => 'call_1', 'name' => 'assign_recruiter', 'input' => [
                'application_id' => $application->id,
                'recruiter_id' => $recruiter->id,
            ]],
        ]])
        ->push(['content' => [['type' => 'text', 'text' => 'Done!']]])]);

    $this->actingAs($this->admin)->post(route('admin.copilot.message'), [
        'message' => "Assign recruiter {$recruiter->id} to application {$application->id}",
    ]);

    $action = CopilotAction::query()->where('tool_name', 'assign_recruiter')->firstOrFail();

    $this->actingAs($this->admin)->post(route('admin.copilot.actions.confirm', $action));

    expect($action->fresh()->status)->toBe('executed');
    expect($application->fresh()->assigned_recruiter_id)->toBe($recruiter->id);
});

test('rejecting a pending action discards it without executing', function () {
    $application = Application::factory()->create();
    $recruiter = User::factory()->create();

    Http::fake(['api.anthropic.com/*' => Http::sequence()
        ->push(['content' => [
            ['type' => 'tool_use', 'id' => 'call_1', 'name' => 'assign_recruiter', 'input' => [
                'application_id' => $application->id,
                'recruiter_id' => $recruiter->id,
            ]],
        ]])
        ->push(['content' => [['type' => 'text', 'text' => 'Okay, I will not do that.']]])]);

    $this->actingAs($this->admin)->post(route('admin.copilot.message'), [
        'message' => "Assign recruiter {$recruiter->id} to application {$application->id}",
    ]);

    $action = CopilotAction::query()->where('tool_name', 'assign_recruiter')->firstOrFail();

    $this->actingAs($this->admin)->post(route('admin.copilot.actions.reject', $action));

    expect($action->fresh()->status)->toBe('rejected');
    expect($application->fresh()->assigned_recruiter_id)->toBeNull();
});

test('an unauthorized tool call is logged as a failed action, not executed', function () {
    Mail::fake();
    $application = Application::factory()->create();

    Http::fake(['api.anthropic.com/*' => Http::sequence()
        ->push(['content' => [
            ['type' => 'tool_use', 'id' => 'call_1', 'name' => 'send_candidate_message', 'input' => [
                'application_id' => $application->id,
                'subject' => 'Hi',
                'body' => 'Hello',
            ]],
        ]])
        ->push(['content' => [['type' => 'text', 'text' => 'I cannot do that.']]])]);

    $this->actingAs($this->editor)->post(route('admin.copilot.message'), [
        'message' => 'Send a message to the candidate',
    ]);

    $action = CopilotAction::query()->where('tool_name', 'send_candidate_message')->firstOrFail();
    expect($action->status)->toBe('failed');
    Mail::assertNothingSent();
});
