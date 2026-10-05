<?php

use App\Mail\CandidateMessage;
use App\Models\Application;
use App\Models\CommunicationTemplate;
use App\Models\CopilotAction;
use App\Models\CopilotMessage;
use App\Models\PolicyDocument;
use App\Models\Service;
use App\Models\User;
use App\Services\Copilot\Tools\ApplicationsSummaryTool;
use App\Services\Copilot\Tools\AssignRecruiterTool;
use App\Services\Copilot\Tools\GetCandidateDossierTool;
use App\Services\Copilot\Tools\GetRecordTool;
use App\Services\Copilot\Tools\ListApplicationsTool;
use App\Services\Copilot\Tools\ListRecordsTool;
use App\Services\Copilot\Tools\SearchCandidatesTool;
use App\Services\Copilot\Tools\SearchPolicyDocsTool;
use App\Services\Copilot\Tools\SendCandidateMessageTool;
use App\Services\Copilot\Tools\SendTemplatedCandidateMessageTool;
use App\Services\Copilot\Tools\TransitionApplicationStatusTool;
use App\Services\Copilot\Tools\UpdateRecordTool;
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

test('every application-scoped tool inherits an applications.* permission check', function () {
    $tools = [
        new SearchCandidatesTool,
        new GetCandidateDossierTool,
        new TransitionApplicationStatusTool,
        new AssignRecruiterTool,
        new SendCandidateMessageTool,
    ];

    foreach ($tools as $tool) {
        expect($tool->authorize($this->admin, []))->toBeTrue();
        expect($tool->authorize($this->editor, []))->toBeFalse();
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

test('a tool-call-only reply never persists null assistant content', function () {
    Http::fake(['api.anthropic.com/*' => Http::sequence()
        ->push(['content' => [
            ['type' => 'tool_use', 'id' => 'call_1', 'name' => 'search_candidates', 'input' => ['query' => 'jane']],
        ]])
        ->push(['content' => [['type' => 'text', 'text' => 'No matches found.']]])]);

    $this->actingAs($this->admin)->post(route('admin.copilot.message'), [
        'message' => 'Find candidates named jane',
    ]);

    $toolCallMessage = CopilotMessage::query()->where('role', 'assistant')->whereHas('action')->firstOrFail();
    expect($toolCallMessage->content)->not->toBeNull();
    expect($toolCallMessage->content)->toBe('');
});

test('a genuinely empty final reply persists a fallback sentence, never null', function () {
    Http::fake(['api.anthropic.com/*' => Http::response(['content' => []])]);

    $this->actingAs($this->admin)->post(route('admin.copilot.message'), [
        'message' => 'hello',
    ]);

    $message = CopilotMessage::query()->where('role', 'assistant')->latest()->firstOrFail();
    expect($message->content)->not->toBeNull();
    expect($message->content)->not->toBe('');
});

test('list_applications defaults to non-terminal statuses and supports status/unassigned filters', function () {
    $openApplication = Application::factory()->create();
    $terminalApplication = Application::factory()->create();
    $terminalApplication->forceFill(['status' => 'ineligible'])->save();
    $recruiter = User::factory()->create();
    $assignedApplication = Application::factory()->create(['assigned_recruiter_id' => $recruiter->id]);

    $tool = new ListApplicationsTool;

    expect($tool->requiresConfirmation())->toBeFalse();
    expect($tool->authorize($this->admin, []))->toBeTrue();
    expect($tool->authorize($this->editor, []))->toBeFalse();

    $default = $tool->execute($this->admin, []);
    $defaultIds = collect($default['applications'])->pluck('id');
    expect($defaultIds)->toContain($openApplication->id, $assignedApplication->id);
    expect($defaultIds)->not->toContain($terminalApplication->id);

    $byStatus = $tool->execute($this->admin, ['status' => 'ineligible']);
    expect(collect($byStatus['applications'])->pluck('id'))->toEqual(collect([$terminalApplication->id]));

    $unassigned = $tool->execute($this->admin, ['unassigned_only' => true]);
    expect(collect($unassigned['applications'])->pluck('id'))->toContain($openApplication->id);
    expect(collect($unassigned['applications'])->pluck('id'))->not->toContain($assignedApplication->id);
});

test('list_records and get_record never leak sensitive user columns', function () {
    $listed = (new ListRecordsTool)->execute($this->admin, ['resource' => 'users']);
    $fetched = (new GetRecordTool)->execute($this->admin, ['resource' => 'users', 'id' => $this->admin->id]);

    foreach ($listed['records'] as $record) {
        expect($record)->not->toHaveKeys(['password', 'remember_token', 'two_factor_secret']);
    }
    expect($fetched['record'])->not->toHaveKeys(['password', 'remember_token', 'two_factor_secret']);
    expect($fetched['record']['id'])->toBe($this->admin->id);
});

test('list_records and get_record reject an unknown resource cleanly', function () {
    $result = (new ListRecordsTool)->execute($this->admin, ['resource' => 'not-a-real-resource']);

    expect($result['success'])->toBeFalse();
});

test('update_record merges current values with a partial patch before validating', function () {
    $service = Service::factory()->create(['is_active' => true]);

    $result = (new UpdateRecordTool)->execute($this->admin, [
        'resource' => 'services',
        'id' => $service->id,
        'fields' => ['is_active' => false],
    ]);

    expect($result['success'])->toBeTrue();
    expect($service->fresh()->is_active)->toBeFalse();
    expect($service->fresh()->title)->toBe($service->title);
});

test('update_record rejects a value that fails the resource\'s real validation rules', function () {
    $service = Service::factory()->create();

    $result = (new UpdateRecordTool)->execute($this->admin, [
        'resource' => 'services',
        'id' => $service->id,
        'fields' => ['title' => ''],
    ]);

    expect($result['success'])->toBeFalse();
    expect($result['errors'])->toHaveKey('title');
});

test('update_record never writes a field with no matching column', function () {
    $service = Service::factory()->create();

    $result = (new UpdateRecordTool)->execute($this->admin, [
        'resource' => 'services',
        'id' => $service->id,
        'fields' => ['not_a_real_field' => 'whatever', 'position' => 5],
    ]);

    expect($result['success'])->toBeTrue();
    expect($service->fresh()->position)->toBe(5);
    expect($service->fresh()->getAttributes())->not->toHaveKey('not_a_real_field');
});

test('update_record excludes resources whose update path isn\'t a plain field set', function () {
    expect((new UpdateRecordTool)->requiredPermission(['resource' => 'staffing-requests']))->toBeNull();
    expect((new UpdateRecordTool)->requiredPermission(['resource' => 'users']))->toBeNull();
    expect((new UpdateRecordTool)->requiredPermission(['resource' => 'pages']))->toBeNull();
});

test('applications_summary matches the dashboard\'s pipeline breakdown', function () {
    Application::factory()->create();
    $terminal = Application::factory()->create();
    $terminal->forceFill(['status' => 'active'])->save();

    $result = (new ApplicationsSummaryTool)->execute($this->admin, []);

    $draftEntry = collect($result['pipeline'])->firstWhere('status', 'draft');
    expect($draftEntry['count'])->toBeGreaterThanOrEqual(1);
    expect(collect($result['pipeline'])->pluck('status'))->not->toContain('active');
});

test('send_templated_candidate_message substitutes placeholders and logs the send', function () {
    Mail::fake();
    $application = Application::factory()->create();
    $template = CommunicationTemplate::query()->create([
        'name' => 'Interview Invitation',
        'subject' => 'Interview for {{position}}',
        'body' => 'Hi {{candidate_name}}, let\'s schedule your interview for {{position}}.',
    ]);

    $result = (new SendTemplatedCandidateMessageTool)->execute($this->admin, [
        'application_id' => $application->id,
        'communication_template_id' => $template->id,
    ]);

    expect($result['success'])->toBeTrue();

    $communication = $application->communications()->latest()->first();
    expect($communication->subject)->toBe("Interview for {$application->jobListing->title}");
    expect($communication->body)->toContain($application->candidate->full_name);
    expect($communication->communication_template_id)->toBe($template->id);

    Mail::assertQueued(CandidateMessage::class);
});
