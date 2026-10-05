<?php

namespace App\Services\Ai\Providers;

use App\Services\Ai\Contracts\AiProvider;
use App\Services\Ai\Exceptions\AiProviderNotConfiguredException;
use App\Services\Ai\ValueObjects\AiChatResult;
use App\Services\Ai\ValueObjects\AiMessage;
use App\Services\Ai\ValueObjects\AiToolCall;
use App\Services\Ai\ValueObjects\AiToolDefinition;
use Illuminate\Support\Facades\Http;

/**
 * Talks to xAI's OpenAI-compatible chat completions API directly via
 * Laravel's Http facade (no SDK dependency, consistent with this
 * project's other vendor integrations).
 */
class XaiProvider implements AiProvider
{
    public function __construct(
        private readonly string $apiKey,
        private readonly string $model,
    ) {}

    public function chat(array $messages, array $tools, ?string $systemPrompt = null): AiChatResult
    {
        if ($this->apiKey === '') {
            throw AiProviderNotConfiguredException::make('xai');
        }

        $response = Http::withToken($this->apiKey)
            ->post('https://api.x.ai/v1/chat/completions', [
                'model' => $this->model,
                'messages' => $this->formatMessages($messages, $systemPrompt),
                ...($tools !== [] ? ['tools' => $this->formatTools($tools)] : []),
            ])->throw()->json();

        return $this->parseResponse($response);
    }

    /**
     * @param  list<AiMessage>  $messages
     * @return list<array<string, mixed>>
     */
    private function formatMessages(array $messages, ?string $systemPrompt): array
    {
        $formatted = $systemPrompt !== null ? [['role' => 'system', 'content' => $systemPrompt]] : [];

        foreach ($messages as $message) {
            if ($message->role === 'tool') {
                $formatted[] = [
                    'role' => 'tool',
                    'tool_call_id' => $message->toolCallId,
                    'content' => $message->content,
                ];

                continue;
            }

            if ($message->toolCalls !== null && $message->toolCalls !== []) {
                $formatted[] = [
                    'role' => 'assistant',
                    'content' => $message->content,
                    'tool_calls' => array_map(fn (AiToolCall $call) => [
                        'id' => $call->id,
                        'type' => 'function',
                        'function' => [
                            'name' => $call->name,
                            'arguments' => json_encode($call->arguments),
                        ],
                    ], $message->toolCalls),
                ];

                continue;
            }

            $formatted[] = ['role' => $message->role, 'content' => $message->content ?? ''];
        }

        return $formatted;
    }

    /**
     * @param  list<AiToolDefinition>  $tools
     * @return list<array<string, mixed>>
     */
    private function formatTools(array $tools): array
    {
        return array_map(fn (AiToolDefinition $tool) => [
            'type' => 'function',
            'function' => [
                'name' => $tool->name,
                'description' => $tool->description,
                'parameters' => $tool->parameters,
            ],
        ], $tools);
    }

    /**
     * @param  array<string, mixed>  $response
     */
    private function parseResponse(array $response): AiChatResult
    {
        $message = $response['choices'][0]['message'] ?? [];

        $toolCalls = array_values(array_map(
            fn (array $call) => new AiToolCall(
                $call['id'],
                $call['function']['name'],
                json_decode($call['function']['arguments'] ?? '{}', true) ?? [],
            ),
            $message['tool_calls'] ?? [],
        ));

        return new AiChatResult($message['content'] ?? null, $toolCalls);
    }
}
