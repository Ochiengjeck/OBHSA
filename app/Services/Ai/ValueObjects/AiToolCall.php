<?php

namespace App\Services\Ai\ValueObjects;

/**
 * A single tool invocation an AI provider's response asked for.
 */
final readonly class AiToolCall
{
    /**
     * @param  array<string, mixed>  $arguments
     */
    public function __construct(
        public string $id,
        public string $name,
        public array $arguments,
    ) {}
}
