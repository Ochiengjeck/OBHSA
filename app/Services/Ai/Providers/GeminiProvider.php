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
 * Talks to Google's Generative Language API directly via Laravel's Http
 * facade (no SDK dependency, consistent with this project's other vendor
 * integrations).
 */
class GeminiProvider implements AiProvider
{
    public function __construct(
        private readonly string $apiKey,
        private readonly string $model,
    ) {}

    public function chat(array $messages, array $tools, ?string $systemPrompt = null): AiChatResult
    {
        if ($this->apiKey === '') {
            throw AiProviderNotConfiguredException::make('gemini');
        }

        $url = "https://generativelanguage.googleapis.com/v1beta/models/{$this->model}:generateContent";

        $response = Http::withHeaders(['x-goog-api-key' => $this->apiKey])
            ->post($url, [
                'contents' => $this->formatMessages($messages),
                ...($systemPrompt !== null ? [
                    'systemInstruction' => ['parts' => [['text' => $systemPrompt]]],
                ] : []),
                ...($tools !== [] ? [
                    'tools' => [['functionDeclarations' => $this->formatTools($tools)]],
                ] : []),
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
                    'role' => 'function',
                    'parts' => [[
                        'functionResponse' => [
                            'name' => $message->toolName,
                            'response' => ['result' => $message->content],
                        ],
                    ]],
                ];
            }

            if ($message->toolCalls !== null && $message->toolCalls !== []) {
                return [
                    'role' => 'model',
                    'parts' => array_map(fn (AiToolCall $call) => [
                        'functionCall' => ['name' => $call->name, 'args' => $call->arguments],
                    ], $message->toolCalls),
                ];
            }

            return [
                'role' => $message->role === 'assistant' ? 'model' : 'user',
                'parts' => [['text' => $message->content]],
            ];
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
            'parameters' => $tool->parameters,
        ], $tools);
    }

    /**
     * @param  array<string, mixed>  $response
     */
    private function parseResponse(array $response): AiChatResult
    {
        $text = null;
        $toolCalls = [];
        $parts = $response['candidates'][0]['content']['parts'] ?? [];

        foreach ($parts as $index => $part) {
            if (isset($part['text'])) {
                $text = ($text ?? '').$part['text'];
            } elseif (isset($part['functionCall'])) {
                $toolCalls[] = new AiToolCall(
                    (string) $index,
                    $part['functionCall']['name'],
                    $part['functionCall']['args'] ?? [],
                );
            }
        }

        return new AiChatResult($text, $toolCalls);
    }
}
