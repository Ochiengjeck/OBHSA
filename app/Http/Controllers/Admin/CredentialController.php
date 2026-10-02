<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\RejectCredentialRequest;
use App\Models\Credential;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CredentialController extends Controller
{
    /**
     * Verify a credential and resolve the matching application requirement.
     */
    public function verify(Request $request, Credential $credential): RedirectResponse
    {
        $credential->verify($request->user());

        $this->resolveRequirement($credential, verified: true);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Credential verified.')]);

        return to_route('admin.candidates.show', $credential->candidate_id);
    }

    /**
     * Reject a credential and resolve the matching application requirement.
     */
    public function reject(RejectCredentialRequest $request, Credential $credential): RedirectResponse
    {
        $credential->reject($request->user(), $request->validated('notes'));

        $this->resolveRequirement($credential, verified: false);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Credential rejected.')]);

        return to_route('admin.candidates.show', $credential->candidate_id);
    }

    /**
     * Resolve the license/certification verification requirement that
     * matches this credential, on every one of the candidate's
     * applications where it's still unresolved — so past, already-decided
     * applications are never rewritten.
     */
    private function resolveRequirement(Credential $credential, bool $verified): void
    {
        $requirementType = $credential->credential_type === 'license'
            ? 'license_verification'
            : 'certification_verification';

        foreach ($credential->candidate->applications as $application) {
            $requirement = $application->requirements()
                ->where('requirement_type', $requirementType)
                ->where('status', 'not_started')
                ->first();

            if (! $requirement) {
                continue;
            }

            $requirement->update(['related_credential_id' => $credential->id]);

            $verified ? $requirement->markComplete() : $requirement->markFailed();
        }
    }
}
