<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SendCopilotMessageRequest;
use App\Models\CopilotAction;
use App\Models\CopilotConversation;
use App\Services\Copilot\CopilotOrchestrator;
use App\Services\Copilot\ToolRegistry;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CopilotController extends Controller
{
    /**
     * Show the chat UI: the user's most recent conversation (creating one
     * if they have none yet), its message history, and any pending
     * confirmation.
     */
    public function index(Request $request): Response
    {
        $conversation = $this->currentConversation($request);
        $conversation->load('messages');

        return Inertia::render('admin/copilot/index', [
            'conversationId' => $conversation->id,
            'messages' => $conversation->messages,
            'pendingAction' => $conversation->actions()->where('status', 'pending_confirmation')->latest()->first(),
        ]);
    }

    /**
     * Send a message and let the copilot respond.
     */
    public function message(SendCopilotMessageRequest $request, CopilotOrchestrator $orchestrator): RedirectResponse
    {
        $conversation = $this->currentConversation($request);

        $orchestrator->handle($request->user(), $conversation, $request->validated('message'));

        return to_route('admin.copilot.index');
    }

    /**
     * Confirm a pending write-tool call, run it, and let the copilot react.
     */
    public function confirmAction(CopilotAction $copilotAction, CopilotOrchestrator $orchestrator, ToolRegistry $tools, Request $request): RedirectResponse
    {
        $tool = $tools->find($copilotAction->tool_name);

        if ($copilotAction->status === 'pending_confirmation' && $tool) {
            $copilotAction->confirm();
            $orchestrator->execute($tool, $request->user(), $copilotAction, $copilotAction->arguments);
            $orchestrator->continueAfterAction($request->user(), $copilotAction->conversation);
        }

        return to_route('admin.copilot.index');
    }

    /**
     * Reject a pending write-tool call and let the copilot react.
     */
    public function rejectAction(CopilotAction $copilotAction, CopilotOrchestrator $orchestrator, Request $request): RedirectResponse
    {
        if ($copilotAction->status === 'pending_confirmation') {
            $copilotAction->reject();
            $orchestrator->continueAfterAction($request->user(), $copilotAction->conversation);
        }

        return to_route('admin.copilot.index');
    }

    /**
     * The acting user's most recent conversation, or a fresh one.
     */
    private function currentConversation(Request $request): CopilotConversation
    {
        return CopilotConversation::query()
            ->where('user_id', $request->user()->id)
            ->latest()
            ->first() ?? CopilotConversation::query()->create(['user_id' => $request->user()->id]);
    }
}
