<?php

namespace App\Services\Ai;

use App\Models\AiSetting;
use App\Services\Ai\Contracts\AiProvider;
use App\Services\Ai\Providers\ClaudeProvider;
use App\Services\Ai\Providers\GeminiProvider;
use App\Services\Ai\Providers\XaiProvider;
use InvalidArgumentException;

class AiProviderFactory
{
    /**
     * Resolve the configured (or explicitly requested) AI provider, using
     * the admin-configured API key override when one is set, falling back
     * to its env/config key otherwise.
     */
    public static function make(?string $provider = null): AiProvider
    {
        $setting = AiSetting::current();
        $provider ??= static::resolveProviderName($setting);

        $settings = config("ai.providers.{$provider}");

        if ($settings === null) {
            throw new InvalidArgumentException("Unknown AI provider \"{$provider}\".");
        }

        $apiKey = $setting->apiKeyFor($provider) ?: ($settings['api_key'] ?? '');

        return match ($provider) {
            'claude' => new ClaudeProvider($apiKey, $settings['model']),
            'gemini' => new GeminiProvider($apiKey, $settings['model']),
            'xai' => new XaiProvider($apiKey, $settings['model']),
            default => throw new InvalidArgumentException("Unknown AI provider \"{$provider}\"."),
        };
    }

    /**
     * The active provider's name: the admin-configured override if one is
     * set, else the env/config default — the single source of truth for
     * which provider is "active" wherever that needs to be known (e.g. the
     * audit trail on a CopilotAction) without duplicating this fallback.
     */
    public static function resolveProviderName(?AiSetting $setting = null): string
    {
        return ($setting ?? AiSetting::current())->provider ?? config('ai.provider');
    }
}
