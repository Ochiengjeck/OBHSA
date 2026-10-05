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
     * The Spatie permission name this call requires, given these
     * arguments — the single source of truth both the human-authorize
     * check and the AI's own permission grant are checked against.
     * Returns null when no permission applies (open to anyone) or when
     * it can't yet be resolved from the given arguments (e.g. a
     * resource-parameterized tool called with [] before the model has
     * chosen a resource) — both cases leave the tool visible in the
     * registry, with the real gate enforced once arguments are known.
     *
     * @param  array<string, mixed>  $arguments
     */
    public function requiredPermission(array $arguments): ?string;

    /**
     * Whether the given user may invoke this tool with these arguments —
     * reusing the exact same permission check the equivalent manual UI
     * action already enforces. The copilot can never do what the acting
     * user couldn't already do by hand.
     *
     * @param  array<string, mixed>  $arguments
     */
    public function authorize(User $user, array $arguments): bool;

    /**
     * Run the tool and return a JSON-serializable result, fed back to the
     * AI provider as the tool's output.
     *
     * @param  array<string, mixed>  $arguments
     * @return array<string, mixed>
     */
    public function execute(User $user, array $arguments): array;
}
