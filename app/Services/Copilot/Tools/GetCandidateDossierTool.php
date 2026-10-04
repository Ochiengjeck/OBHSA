<?php

namespace App\Services\Copilot\Tools;

use App\Models\Candidate;
use App\Models\User;
use App\Services\Copilot\Contracts\CopilotTool;

/**
 * Read-only — a condensed version of the admin candidate dossier, sized
 * for a model's context window rather than a full page render.
 */
class GetCandidateDossierTool implements CopilotTool
{
    public function name(): string
    {
        return 'get_candidate_dossier';
    }

    public function description(): string
    {
        return 'Get a candidate\'s profile summary: contact info, every application with its status, and credential verification status.';
    }

    public function parameters(): array
    {
        return [
            'type' => 'object',
            'properties' => [
                'candidate_id' => [
                    'type' => 'integer',
                    'description' => 'The candidate\'s id.',
                ],
            ],
            'required' => ['candidate_id'],
        ];
    }

    public function requiresConfirmation(): bool
    {
        return false;
    }

    public function authorize(User $user): bool
    {
        return $user->can('applications.view');
    }

    public function execute(User $user, array $arguments): array
    {
        $candidate = Candidate::query()
            ->with([
                'applications:id,candidate_id,job_listing_id,status,primary_specialty,created_at',
                'applications.jobListing:id,title',
                'credentials:id,candidate_id,credential_name,verification_status,expiry_date',
            ])
            ->findOrFail((int) $arguments['candidate_id']);

        return [
            'candidate' => [
                'id' => $candidate->id,
                'full_name' => $candidate->full_name,
                'email' => $candidate->email,
                'phone' => $candidate->phone,
            ],
            'applications' => $candidate->applications->map(fn ($application) => [
                'id' => $application->id,
                'status' => $application->status,
                'job_listing' => $application->jobListing?->title,
                'primary_specialty' => $application->primary_specialty,
            ])->all(),
            'credentials' => $candidate->credentials->map(fn ($credential) => [
                'name' => $credential->credential_name,
                'verification_status' => $credential->verification_status,
                'expiry_date' => $credential->expiry_date?->toDateString(),
            ])->all(),
        ];
    }
}
