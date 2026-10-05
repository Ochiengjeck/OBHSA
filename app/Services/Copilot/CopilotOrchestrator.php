<?php

namespace App\Services\Copilot;

use App\Models\AiSetting;
use App\Models\CopilotAction;
use App\Models\CopilotConversation;
use App\Models\CopilotMessage;
use App\Models\User;
use App\Services\Ai\AiProviderFactory;
use App\Services\Ai\ValueObjects\AiMessage;
use App\Services\Ai\ValueObjects\AiToolCall;
use App\Services\Ai\ValueObjects\AiToolDefinition;
use App\Services\Copilot\Contracts\CopilotTool;
use Illuminate\Support\Collection;
use Throwable;

/**
 * Drives one conversation: builds history for the active AI provider,
 * executes read-only tool calls immediately, and stops to await
 * confirmation on a write tool rather than ever auto-executing one.
 */
class CopilotOrchestrator
{
    /**
     * Upper bound on how many times this conversation will call the
     * provider in a single turn, so a model that keeps requesting tools
     * can never loop forever.
     */
    private const int MAX_ROUND_TRIPS = 5;

    public function __construct(private readonly ToolRegistry $tools) {}

    /**
     * Append the user's message and converse until the model gives a
     * plain-text reply or asks to run a tool that needs confirmation.
     *
     * @return array{messages: Collection<int, CopilotMessage>, pendingAction: CopilotAction|null}
     */
    public function handle(User $user, CopilotConversation $conversation, string $userMessage): array
    {
        $conversation->messages()->create(['role' => 'user', 'content' => $userMessage]);

        return $this->converse($user, $conversation);
    }

    /**
     * Resume the conversation after a pending action was confirmed or
     * rejected, so the model can react to the outcome.
     *
     * @return array{messages: Collection<int, CopilotMessage>, pendingAction: CopilotAction|null}
     */
    public function continueAfterAction(User $user, CopilotConversation $conversation): array
    {
        return $this->converse($user, $conversation);
    }

    /**
     * @return array{messages: Collection<int, CopilotMessage>, pendingAction: CopilotAction|null}
     */
    private function converse(User $user, CopilotConversation $conversation): array
    {
        $provider = AiProviderFactory::make();
        $providerName = AiProviderFactory::resolveProviderName();
        $newMessages = collect();

        $toolDefinitions = array_values($this->tools->all()
            ->map(fn (CopilotTool $tool) => new AiToolDefinition($tool->name(), $tool->description(), $tool->parameters()))
            ->all());

        for ($round = 0; $round < self::MAX_ROUND_TRIPS; $round++) {
            $result = $provider->chat($this->buildHistory($conversation), $toolDefinitions, $this->systemPrompt());

            // Only the first requested tool call is acted on per round —
            // kept simple since this copilot never needs to parallelize
            // tool use, and it keeps one action per assistant message.
            $toolCall = $result->toolCalls[0] ?? null;

            $assistantMessage = $conversation->messages()->create([
                'role' => 'assistant',
                'content' => $this->resolveAssistantContent($result->text, $toolCall !== null),
            ]);
            $newMessages->push($assistantMessage);

            if ($toolCall === null) {
                break;
            }

            $tool = $this->tools->find($toolCall->name);
            $aiGranted = $tool && AiSetting::current()->hasGrantedPermission($tool->requiredPermission($toolCall->arguments));

            if (! $tool || ! $aiGranted || ! $tool->authorize($user, $toolCall->arguments)) {
                $action = $this->recordAction($conversation, $assistantMessage, $toolCall, $providerName, $user);
                $action->markFailed(['error' => 'This tool is unavailable or you are not authorized to use it.']);

                continue;
            }

            $action = $this->recordAction($conversation, $assistantMessage, $toolCall, $providerName, $user);

            if ($tool->requiresConfirmation()) {
                return ['messages' => $newMessages, 'pendingAction' => $action];
            }

            $this->execute($tool, $user, $action, $toolCall->arguments);
        }

        return ['messages' => $newMessages, 'pendingAction' => null];
    }

    /**
     * Never let an assistant turn persist (and later replay to a provider)
     * as null text: a tool-call turn's words aren't the user-facing reply
     * anyway, so it stores empty; a genuinely empty final reply gets a real
     * fallback sentence instead of silently storing nothing, since a stored
     * null round-trips back to providers like Gemini as a literal
     * `"text": null` field and degrades the context they see on later turns.
     */
    private function resolveAssistantContent(?string $text, bool $hasToolCall): string
    {
        if ($text !== null && $text !== '') {
            return $text;
        }

        return $hasToolCall ? '' : "I don't have a response for that — could you rephrase?";
    }

    /**
     * Run a tool and log its outcome on the already-created action row.
     *
     * @param  array<string, mixed>  $arguments
     */
    public function execute(CopilotTool $tool, User $user, CopilotAction $action, array $arguments): void
    {
        try {
            $result = $tool->execute($user, $arguments);
            $action->markExecuted($result);
        } catch (Throwable $exception) {
            $action->markFailed(['error' => $exception->getMessage()]);
        }
    }

    private function recordAction(
        CopilotConversation $conversation,
        CopilotMessage $assistantMessage,
        AiToolCall $toolCall,
        string $providerName,
        User $user,
    ): CopilotAction {
        return $conversation->actions()->create([
            'copilot_message_id' => $assistantMessage->id,
            'tool_name' => $toolCall->name,
            'arguments' => $toolCall->arguments,
            'provider' => $providerName,
            'user_id' => $user->id,
        ]);
    }

    /**
     * Rebuild this conversation's history in the provider-neutral shape,
     * pairing each assistant tool call with its action's recorded result
     * (never a separate stored message — the CopilotAction row is the
     * single source of truth for what a tool call returned).
     *
     * @return list<AiMessage>
     */
    private function buildHistory(CopilotConversation $conversation): array
    {
        $actionsByMessageId = $conversation->actions()->get()->keyBy('copilot_message_id');
        $history = [];

        foreach ($conversation->messages()->oldest()->get() as $message) {
            if ($message->role === 'user') {
                $history[] = AiMessage::user($message->content ?? '');

                continue;
            }

            /** @var CopilotAction|null $action */
            $action = $actionsByMessageId->get($message->id);

            if (! $action) {
                $history[] = AiMessage::assistant($message->content ?? '');

                continue;
            }

            $history[] = AiMessage::assistant($message->content ?? '', [
                new AiToolCall((string) $action->id, $action->tool_name, $action->arguments),
            ]);

            if ($action->status === 'rejected') {
                $history[] = AiMessage::toolResult((string) $action->id, $action->tool_name, json_encode([
                    'rejected' => true,
                    'message' => 'The user declined to run this action.',
                ]) ?: '{}');
            } elseif (in_array($action->status, ['executed', 'failed'], true)) {
                $history[] = AiMessage::toolResult((string) $action->id, $action->tool_name, json_encode($action->result) ?: '{}');
            }
        }

        return $history;
    }

    private function systemPrompt(): string
    {
        return 'You are the OBHSA staffing-agency admin copilot. You help recruiting staff look up candidates and, '
            .'when asked, make changes on their behalf using the tools available to you. Never claim a write action '
            .'succeeded unless its tool result confirms it. Be concise.';
    }
}
