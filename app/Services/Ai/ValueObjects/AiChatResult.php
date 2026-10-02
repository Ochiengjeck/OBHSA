<?php

namespace App\Services\Ai\ValueObjects;

/**
 * A provider's response to a chat call: a text reply, any tool calls it
 * asked to make, or both (some providers narrate before calling a tool).
 */
final readonly class AiChatResult
{
    /**
     * @param  list<AiToolCall>  $toolCalls
     */
    public function __construct(
        public ?string $text,
        public array $toolCalls = [],
    ) {}
}
