<?php

namespace App\Services\Ai\Contracts;

use App\Services\Ai\ValueObjects\AiChatResult;
use App\Services\Ai\ValueObjects\AiMessage;
use App\Services\Ai\ValueObjects\AiToolDefinition;

interface AiProvider
{
    /**
     * Send a conversation (plus any available tools) to the provider and
     * return its reply, translating to and from the provider's own API
     * shape internally.
     *
     * @param  list<AiMessage>  $messages
     * @param  list<AiToolDefinition>  $tools
     */
    public function chat(array $messages, array $tools, ?string $systemPrompt = null): AiChatResult;
}
