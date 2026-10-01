<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreStaffingRequestRequest;
use App\Mail\StaffingRequestReceived;
use App\Models\SiteSetting;
use App\Models\StaffingRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class StaffingRequestController extends Controller
{
    /**
     * Submit a facility staffing request.
     */
    public function store(StoreStaffingRequestRequest $request): RedirectResponse
    {
        $staffingRequest = StaffingRequest::query()->create($request->validated());

        Mail::to(SiteSetting::get('email', config('mail.from.address')))
            ->queue(new StaffingRequestReceived($staffingRequest));

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Request submitted. Our team will follow up shortly.')]);

        return back();
    }
}
