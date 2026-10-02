<?php

namespace App\Services\Ai\ValueObjects;

/**
 * A tool advertised to an AI provider, in a vendor-neutral shape each
 * provider translates into its own request format.
 */
final readonly class AiToolDefinition
{
    /**
     * @param  array<string, mixed>  $parameters  JSON-schema object describing the tool's arguments
     */
    public function __construct(
        public string $name,
        public string $description,
        public array $parameters,
    ) {}
}
