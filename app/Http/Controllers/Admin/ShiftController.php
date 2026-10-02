<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreShiftRequest;
use App\Http\Requests\Admin\UpdateShiftRequest;
use App\Models\Employee;
use App\Models\Facility;
use App\Models\Shift;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ShiftController extends Controller
{
    /**
     * List a facility's shifts.
     */
    public function index(Facility $facility): Response
    {
        return Inertia::render('admin/facilities/shifts/index', [
            'facility' => $facility,
            'shifts' => $facility->shifts()->withCount('assignments')->get(),
        ]);
    }

    /**
     * Show the form to schedule a new shift at a facility.
     */
    public function create(Facility $facility): Response
    {
        return Inertia::render('admin/facilities/shifts/create', [
            'facility' => $facility,
        ]);
    }

    /**
     * Schedule a new shift.
     */
    public function store(StoreShiftRequest $request, Facility $facility): RedirectResponse
    {
        $facility->shifts()->create([
            ...$request->validated(),
            'created_by' => $request->user()->id,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Shift scheduled.')]);

        return to_route('admin.facilities.shifts.index', $facility);
    }

    /**
     * Show a shift's detail, assignments, and the assignable employee list.
     */
    public function show(Shift $shift): Response
    {
        $shift->load(['facility', 'assignments.employee.candidate:id,full_name,email']);

        $assignedEmployeeIds = $shift->assignments()
            ->whereIn('status', ['assigned', 'confirmed', 'completed'])
            ->pluck('employee_id');

        return Inertia::render('admin/facilities/shifts/show', [
            'shift' => $shift,
            'availableEmployees' => Employee::query()
                ->where('specialty', $shift->specialty)
                ->where('status', 'active')
                ->whereNotIn('id', $assignedEmployeeIds)
                ->with('candidate:id,full_name')
                ->get(),
        ]);
    }

    /**
     * Show the form to edit a shift.
     */
    public function edit(Shift $shift): Response
    {
        return Inertia::render('admin/facilities/shifts/edit', [
            'facility' => $shift->facility,
            'shift' => $shift,
        ]);
    }

    /**
     * Update a shift. Status is handled separately from the rest of the
     * fillable fields since it is never directly mass-assignable.
     */
    public function update(UpdateShiftRequest $request, Shift $shift): RedirectResponse
    {
        $shift->update($request->safe()->except('status'));

        if ($request->validated('status') === 'cancelled') {
            $shift->cancel();
        } elseif ($request->filled('status')) {
            $shift->forceFill(['status' => 'open'])->save();
            $shift->recomputeStatus();
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Shift updated.')]);

        return to_route('admin.facilities.shifts.index', $shift->facility_id);
    }

    /**
     * Delete a shift.
     */
    public function destroy(Shift $shift): RedirectResponse
    {
        $facilityId = $shift->facility_id;

        $shift->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Shift deleted.')]);

        return to_route('admin.facilities.shifts.index', $facilityId);
    }
}
