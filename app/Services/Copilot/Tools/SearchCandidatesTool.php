<?php

namespace App\Services\Copilot\Tools;

use App\Models\Candidate;
use App\Models\User;
use App\Services\Copilot\Contracts\CopilotTool;
use App\Services\Copilot\Tools\Concerns\AuthorizesViaPermission;

/**
 * Read-only — wraps the same candidate lookup the admin dossier search
 * already performs by hand.
 */
class SearchCandidatesTool implements CopilotTool
{
    use AuthorizesViaPermission;

    public function name(): string
    {
        return 'search_candidates';
    }

    public function description(): string
    {
        return "Search candidates by name or email. Returns each match's id, name, and email.";
    }

    public function parameters(): array
    {
        return [
            'type' => 'object',
            'properties' => [
                'query' => [
                    'type' => 'string',
                    'description' => 'Name or email text to search for.',
                ],
            ],
            'required' => ['query'],
        ];
    }

    public function requiresConfirmation(): bool
    {
        return false;
    }

    protected function permission(): string
    {
        return 'applications.view';
    }

    public function execute(User $user, array $arguments): array
    {
        $query = (string) $arguments['query'];

        $candidates = Candidate::query()
            ->where(fn ($q) => $q->where('full_name', 'like', "%{$query}%")->orWhere('email', 'like', "%{$query}%"))
            ->orderBy('full_name')
            ->limit(10)
            ->get(['id', 'full_name', 'email']);

        return ['candidates' => $candidates->toArray()];
    }
}
