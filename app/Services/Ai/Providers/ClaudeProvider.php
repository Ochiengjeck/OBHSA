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
 * Talks to Anthropic's Messages API directly via Laravel's Http facade
 * (no SDK dependency, consistent with this project's other vendor
 * integrations).
 */
class ClaudeProvider implements AiProvider
{
    public function __construct(
        private readonly string $apiKey,
        private readonly string $model,
    ) {}

    public function chat(array $messages, array $tools, ?string $systemPrompt = null): AiChatResult
    {
        if ($this->apiKey === '') {
            throw AiProviderNotConfiguredException::make('claude');
        }

        $response = Http::withHeaders([
            'x-api-key' => $this->apiKey,
            'anthropic-version' => '2023-06-01',
        ])->post('https://api.anthropic.com/v1/messages', [
            'model' => $this->model,
            'max_tokens' => 2048,
            ...($systemPrompt !== null ? ['system' => $systemPrompt] : []),
            'messages' => $this->formatMessages($messages),
            ...($tools !== [] ? ['tools' => $this->formatTools($tools)] : []),
        ])->throw()->json();

        return $this->parseResponse($response);
    }

    /**
     * @param  list<AiMessage>  $messages
     * @return list<array<string, mixed>>
     */
    private function formatMessages(array $messages): array
    {
        return array_map(function (AiMessage $message) {
            if ($message->role === 'tool') {
                return [
                    'role' => 'user',
                    'content' => [[
                        'type' => 'tool_result',
                        'tool_use_id' => $message->toolCallId,
                        'content' => $message->content,
                    ]],
                ];
            }

            if ($message->toolCalls !== null && $message->toolCalls !== []) {
                $content = [];

                if ($message->content !== null) {
                    $content[] = ['type' => 'text', 'text' => $message->content];
                }

                foreach ($message->toolCalls as $toolCall) {
                    $content[] = [
                        'type' => 'tool_use',
                        'id' => $toolCall->id,
                        'name' => $toolCall->name,
                        'input' => $toolCall->arguments,
                    ];
                }

                return ['role' => 'assistant', 'content' => $content];
            }

            return ['role' => $message->role, 'content' => $message->content ?? ''];
        }, $messages);
    }

    /**
     * @param  list<AiToolDefinition>  $tools
     * @return list<array<string, mixed>>
     */
    private function formatTools(array $tools): array
    {
        return array_map(fn (AiToolDefinition $tool) => [
            'name' => $tool->name,
            'description' => $tool->description,
            'input_schema' => $tool->parameters,
        ], $tools);
    }

    /**
     * @param  array<string, mixed>  $response
     */
    private function parseResponse(array $response): AiChatResult
    {
        $text = null;
        $toolCalls = [];

        foreach ($response['content'] ?? [] as $block) {
            if ($block['type'] === 'text') {
                $text = ($text ?? '').$block['text'];
            } elseif ($block['type'] === 'tool_use') {
                $toolCalls[] = new AiToolCall($block['id'], $block['name'], $block['input'] ?? []);
            }
        }

        return new AiChatResult($text, $toolCalls);
    }
}
