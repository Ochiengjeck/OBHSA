<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreReferenceCheckRequest;
use App\Models\EmploymentHistory;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class ReferenceCheckController extends Controller
{
    /**
     * Log a reference check against an employment history entry.
     */
    public function store(StoreReferenceCheckRequest $request, EmploymentHistory $employmentHistory): RedirectResponse
    {
        $employmentHistory->referenceChecks()->create([
            ...$request->validated(),
            'checked_by' => $request->user()->id,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Reference check logged.')]);

        return to_route('admin.candidates.show', $employmentHistory->candidate_id);
    }
}
