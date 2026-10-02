<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreShiftAssignmentRequest;
use App\Http\Requests\Admin\UpdateShiftAssignmentRequest;
use App\Models\Shift;
use App\Models\ShiftAssignment;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class ShiftAssignmentController extends Controller
{
    /**
     * Assign an employee to a shift.
     */
    public function store(StoreShiftAssignmentRequest $request, Shift $shift): RedirectResponse
    {
        $shift->assignments()->create([
            'employee_id' => $request->validated('employee_id'),
            'assigned_at' => now(),
            'assigned_by' => $request->user()->id,
        ]);

        $shift->recomputeStatus();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Employee assigned.')]);

        return to_route('admin.shifts.show', $shift);
    }

    /**
     * Update an assignment's status.
     */
    public function update(UpdateShiftAssignmentRequest $request, ShiftAssignment $shiftAssignment): RedirectResponse
    {
        match ($request->validated('status')) {
            'confirmed' => $shiftAssignment->confirm(),
            'completed' => $shiftAssignment->complete(),
            'no_show' => $shiftAssignment->markNoShow(),
            default => $shiftAssignment->cancel(),
        };

        $shiftAssignment->shift->recomputeStatus();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Assignment updated.')]);

        return to_route('admin.shifts.show', $shiftAssignment->shift_id);
    }
}
