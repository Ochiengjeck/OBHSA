<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateApplicationRequirementRequest;
use App\Models\ApplicationRequirement;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class ApplicationRequirementController extends Controller
{
    /**
     * Manually mark a requirement passed or failed. The only path to
     * resolving requirement types with no other automation (e.g.
     * employment_history_verification, education_verification).
     */
    public function update(UpdateApplicationRequirementRequest $request, ApplicationRequirement $applicationRequirement): RedirectResponse
    {
        $request->validated('status') === 'passed'
            ? $applicationRequirement->markComplete()
            : $applicationRequirement->markFailed();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Requirement updated.')]);

        return to_route('admin.candidates.show', $applicationRequirement->application->candidate_id);
    }
}
