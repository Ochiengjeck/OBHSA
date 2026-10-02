<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Active Copilot Provider
    |--------------------------------------------------------------------------
    |
    | Which configured provider the admin copilot uses by default: "claude",
    | "gemini", or "xai". Each provider below works independently as long as
    | its own API key is set, regardless of which one is active here.
    |
    */

    'provider' => env('AI_COPILOT_PROVIDER', 'claude'),

    'providers' => [

        'claude' => [
            'api_key' => env('ANTHROPIC_API_KEY'),
            'model' => env('AI_CLAUDE_MODEL', 'claude-sonnet-5'),
        ],

        'gemini' => [
            'api_key' => env('GEMINI_API_KEY'),
            'model' => env('AI_GEMINI_MODEL', 'gemini-2.5-flash'),
        ],

        'xai' => [
            'api_key' => env('XAI_API_KEY'),
            'model' => env('AI_XAI_MODEL', 'grok-4'),
        ],

    ],

];
