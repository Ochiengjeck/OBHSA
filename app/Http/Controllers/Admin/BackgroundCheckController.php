<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreBackgroundCheckRequest;
use App\Http\Requests\Admin\UpdateBackgroundCheckRequest;
use App\Models\Application;
use App\Models\BackgroundCheck;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class BackgroundCheckController extends Controller
{
    /**
     * Initiate a background check for an application.
     */
    public function store(StoreBackgroundCheckRequest $request, Application $application): RedirectResponse
    {
        $application->backgroundChecks()->create([
            ...$request->validated(),
            'initiated_at' => now(),
            'initiated_by' => $request->user()->id,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Background check initiated.')]);

        return to_route('admin.candidates.show', $application->candidate_id);
    }

    /**
     * Record a background check's result (or cancel it), resolving the
     * matching requirement when a result comes back.
     */
    public function update(UpdateBackgroundCheckRequest $request, BackgroundCheck $backgroundCheck): RedirectResponse
    {
        $status = $request->validated('status');

        if ($status === 'cancelled') {
            $backgroundCheck->cancel();
        } else {
            $backgroundCheck->recordResult($status, $request->validated('notes'), $request->user());

            $requirement = $backgroundCheck->application->requirements()
                ->where('requirement_type', 'background_check')
                ->where('status', 'not_started')
                ->first();

            if ($requirement) {
                $status === 'clear' ? $requirement->markComplete() : $requirement->markFailed();
            }
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Background check updated.')]);

        return to_route('admin.candidates.show', $backgroundCheck->application->candidate_id);
    }
}
