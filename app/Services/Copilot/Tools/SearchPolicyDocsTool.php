<?php

namespace App\Services\Copilot\Tools;

use App\Models\PolicyDocument;
use App\Models\User;
use App\Services\Copilot\Contracts\CopilotTool;

/**
 * Read-only — the "RAG" step for this phase, honestly scoped to a
 * portable LIKE-based keyword search over admin-managed policy documents
 * rather than embeddings (no vector DB was approved for this project).
 */
class SearchPolicyDocsTool implements CopilotTool
{
    public function name(): string
    {
        return 'search_policy_docs';
    }

    public function description(): string
    {
        return 'Search OBHSA\'s internal policy documents by keyword. Returns matching titles with a short snippet of the matching text.';
    }

    public function parameters(): array
    {
        return [
            'type' => 'object',
            'properties' => [
                'query' => ['type' => 'string', 'description' => 'Keyword(s) to search for.'],
            ],
            'required' => ['query'],
        ];
    }

    public function requiresConfirmation(): bool
    {
        return false;
    }

    public function authorize(User $user): bool
    {
        return true;
    }

    public function execute(User $user, array $arguments): array
    {
        $query = (string) $arguments['query'];

        $documents = PolicyDocument::query()
            ->where('is_active', true)
            ->where(fn ($q) => $q->where('title', 'like', "%{$query}%")->orWhere('body', 'like', "%{$query}%"))
            ->limit(5)
            ->get();

        return [
            'results' => $documents->map(fn (PolicyDocument $document) => [
                'id' => $document->id,
                'title' => $document->title,
                'snippet' => $this->snippet($document->body, $query),
            ])->all(),
        ];
    }

    /**
     * A short excerpt of the document body around the first match, so the
     * model can ground its answer without the whole document.
     */
    private function snippet(string $body, string $query): string
    {
        $position = mb_stripos($body, $query);

        if ($position === false) {
            return mb_substr($body, 0, 200);
        }

        $start = max(0, $position - 80);

        return mb_substr($body, $start, 240);
    }
}
