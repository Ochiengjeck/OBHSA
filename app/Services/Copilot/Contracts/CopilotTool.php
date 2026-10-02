<?php

namespace App\Services\Copilot\Contracts;

use App\Models\User;

interface CopilotTool
{
    /**
     * The tool's name, as advertised to the AI provider and stored on
     * every CopilotAction audit row.
     */
    public function name(): string;

    public function description(): string;

    /**
     * JSON-schema object describing this tool's arguments.
     *
     * @return array<string, mixed>
     */
    public function parameters(): array;

    /**
     * Whether this tool mutates data and must therefore be confirmed by
     * the acting user before it executes, rather than running immediately.
     */
    public function requiresConfirmation(): bool;

    /**
     * Whether the given user may invoke this tool at all — reusing the
     * exact same permission check the equivalent manual UI action
     * already enforces. The copilot can never do what the acting user
     * couldn't already do by hand.
     */
    public function authorize(User $user): bool;

    /**
     * Run the tool and return a JSON-serializable result, fed back to the
     * AI provider as the tool's output.
     *
     * @param  array<string, mixed>  $arguments
     * @return array<string, mixed>
     */
    public function execute(User $user, array $arguments): array;
}
