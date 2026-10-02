<?php

namespace App\Services\Ai\ValueObjects;

/**
 * A single turn in a conversation, in a vendor-neutral shape. Three kinds:
 * a plain user/assistant text turn, an assistant turn that requested tool
 * calls (role "assistant" with $toolCalls set), or a tool-result turn
 * (role "tool") reporting what a previously requested call returned.
 */
final readonly class AiMessage
{
    /**
     * @param  'user'|'assistant'|'tool'  $role
     * @param  list<AiToolCall>|null  $toolCalls
     */
    public function __construct(
        public string $role,
        public ?string $content = null,
        public ?array $toolCalls = null,
        public ?string $toolCallId = null,
        public ?string $toolName = null,
    ) {}

    public static function user(string $content): self
    {
        return new self('user', $content);
    }

    /**
     * @param  list<AiToolCall>|null  $toolCalls
     */
    public static function assistant(?string $content, ?array $toolCalls = null): self
    {
        return new self('assistant', $content, $toolCalls);
    }

    public static function toolResult(string $toolCallId, string $toolName, string $content): self
    {
        return new self('tool', $content, toolCallId: $toolCallId, toolName: $toolName);
    }
}
