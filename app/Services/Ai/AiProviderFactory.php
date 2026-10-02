<?php

namespace App\Services\Ai;

use App\Services\Ai\Contracts\AiProvider;
use App\Services\Ai\Providers\ClaudeProvider;
use App\Services\Ai\Providers\GeminiProvider;
use App\Services\Ai\Providers\XaiProvider;
use InvalidArgumentException;

class AiProviderFactory
{
    /**
     * Resolve the configured (or explicitly requested) AI provider.
     */
    public static function make(?string $provider = null): AiProvider
    {
        $provider ??= config('ai.provider');

        $settings = config("ai.providers.{$provider}");

        if ($settings === null) {
            throw new InvalidArgumentException("Unknown AI provider \"{$provider}\".");
        }

        return match ($provider) {
            'claude' => new ClaudeProvider($settings['api_key'] ?? '', $settings['model']),
            'gemini' => new GeminiProvider($settings['api_key'] ?? '', $settings['model']),
            'xai' => new XaiProvider($settings['api_key'] ?? '', $settings['model']),
            default => throw new InvalidArgumentException("Unknown AI provider \"{$provider}\"."),
        };
    }
}
