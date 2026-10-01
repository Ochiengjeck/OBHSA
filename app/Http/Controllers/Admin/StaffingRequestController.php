<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateStaffingRequestRequest;
use App\Models\StaffingRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StaffingRequestController extends Controller
{
    /**
     * List staffing-request leads, optionally filtered by status.
     */
    public function index(Request $request): Response
    {
        $requests = StaffingRequest::query()
            ->when($request->string('status')->isNotEmpty(), fn ($query) => $query->where('status', $request->string('status')))
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('admin/staffing-requests/index', [
            'requests' => $requests,
            'filters' => ['status' => $request->string('status')->value() ?: null],
        ]);
    }

    /**
     * Show a single staffing-request lead.
     */
    public function show(StaffingRequest $staffingRequest): Response
    {
        $staffingRequest->load('handler:id,name');

        return Inertia::render('admin/staffing-requests/show', [
            'staffingRequest' => $staffingRequest,
        ]);
    }

    /**
     * Update a staffing-request lead's status and notes.
     */
    public function update(UpdateStaffingRequestRequest $request, StaffingRequest $staffingRequest): RedirectResponse
    {
        $staffingRequest->update([
            ...$request->validated(),
            'handled_by' => $request->user()->id,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Staffing request updated.')]);

        return to_route('admin.staffing-requests.show', $staffingRequest);
    }
}
