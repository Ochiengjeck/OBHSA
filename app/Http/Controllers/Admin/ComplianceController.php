<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Credential;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ComplianceController extends Controller
{
    /**
     * List active employees' credentials expiring within 90 days, most
     * urgent first.
     */
    public function index(Request $request): Response
    {
        $credentials = Credential::query()
            ->whereNotNull('expiry_date')
            ->whereHas('candidate.employee', fn ($query) => $query->where('status', 'active'))
            ->where('expiry_date', '<=', now()->addDays(90))
            ->when(
                $request->string('filter')->value() === 'overdue',
                fn ($query) => $query->where('expiry_date', '<', now()),
            )
            ->with('candidate:id,full_name,email')
            ->orderBy('expiry_date')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('admin/compliance/index', [
            'credentials' => $credentials,
            'filters' => ['filter' => $request->string('filter')->value() ?: null],
        ]);
    }
}
