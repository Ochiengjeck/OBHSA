<?php

use App\Services\Ai\AiProviderFactory;
use App\Services\Ai\Exceptions\AiProviderNotConfiguredException;
use App\Services\Ai\ValueObjects\AiMessage;
use App\Services\Ai\ValueObjects\AiToolDefinition;
use Illuminate\Support\Facades\Http;

test('a provider with no api key throws a clear configuration exception', function () {
    config(['ai.providers.claude.api_key' => '']);

    expect(fn () => AiProviderFactory::make('claude')->chat([AiMessage::user('hi')], []))
        ->toThrow(AiProviderNotConfiguredException::class);
});

test('requesting an unknown provider throws', function () {
    expect(fn () => AiProviderFactory::make('unknown-provider'))
        ->toThrow(InvalidArgumentException::class);
});

test('ClaudeProvider parses a plain text reply', function () {
    config(['ai.providers.claude.api_key' => 'test-key']);

    Http::fake(['api.anthropic.com/*' => Http::response([
        'content' => [['type' => 'text', 'text' => 'Hello there.']],
    ])]);

    $result = AiProviderFactory::make('claude')->chat([AiMessage::user('Hi')], []);

    expect($result->text)->toBe('Hello there.');
    expect($result->toolCalls)->toBe([]);
});

test('ClaudeProvider parses a tool-use reply', function () {
    config(['ai.providers.claude.api_key' => 'test-key']);

    Http::fake(['api.anthropic.com/*' => Http::response([
        'content' => [
            ['type' => 'text', 'text' => 'Let me look that up.'],
            ['type' => 'tool_use', 'id' => 'call_1', 'name' => 'search_candidates', 'input' => ['query' => 'jane']],
        ],
    ])]);

    $tool = new AiToolDefinition('search_candidates', 'Search candidates', ['type' => 'object', 'properties' => []]);
    $result = AiProviderFactory::make('claude')->chat([AiMessage::user('Find jane')], [$tool]);

    expect($result->text)->toBe('Let me look that up.');
    expect($result->toolCalls)->toHaveCount(1);
    expect($result->toolCalls[0]->name)->toBe('search_candidates');
    expect($result->toolCalls[0]->arguments)->toBe(['query' => 'jane']);

    Http::assertSent(function ($request) {
        return $request->url() === 'https://api.anthropic.com/v1/messages'
            && $request['tools'][0]['name'] === 'search_candidates';
    });
});

test('GeminiProvider parses a function-call reply', function () {
    config(['ai.providers.gemini.api_key' => 'test-key']);

    Http::fake(['generativelanguage.googleapis.com/*' => Http::response([
        'candidates' => [[
            'content' => [
                'parts' => [
                    ['functionCall' => ['name' => 'search_candidates', 'args' => ['query' => 'jane']]],
                ],
            ],
        ]],
    ])]);

    $tool = new AiToolDefinition('search_candidates', 'Search candidates', ['type' => 'object', 'properties' => []]);
    $result = AiProviderFactory::make('gemini')->chat([AiMessage::user('Find jane')], [$tool]);

    expect($result->toolCalls)->toHaveCount(1);
    expect($result->toolCalls[0]->name)->toBe('search_candidates');
    expect($result->toolCalls[0]->arguments)->toBe(['query' => 'jane']);
});

test('XaiProvider parses a tool_calls reply', function () {
    config(['ai.providers.xai.api_key' => 'test-key']);

    Http::fake(['api.x.ai/*' => Http::response([
        'choices' => [[
            'message' => [
                'content' => null,
                'tool_calls' => [[
                    'id' => 'call_1',
                    'function' => ['name' => 'search_candidates', 'arguments' => '{"query":"jane"}'],
                ]],
            ],
        ]],
    ])]);

    $tool = new AiToolDefinition('search_candidates', 'Search candidates', ['type' => 'object', 'properties' => []]);
    $result = AiProviderFactory::make('xai')->chat([AiMessage::user('Find jane')], [$tool]);

    expect($result->toolCalls)->toHaveCount(1);
    expect($result->toolCalls[0]->name)->toBe('search_candidates');
    expect($result->toolCalls[0]->arguments)->toBe(['query' => 'jane']);
});
