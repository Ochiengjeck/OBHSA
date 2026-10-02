<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeController extends Controller
{
    /**
     * List all employees, optionally filtered by status or specialty.
     */
    public function index(Request $request): Response
    {
        $employees = Employee::query()
            ->with('candidate:id,full_name,email')
            ->when($request->filled('status'), fn ($query) => $query->where('status', $request->string('status')))
            ->when($request->filled('specialty'), fn ($query) => $query->where('specialty', $request->string('specialty')))
            ->orderBy('hire_date', 'desc')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('admin/employees/index', [
            'employees' => $employees,
            'filters' => [
                'status' => $request->string('status')->value() ?: null,
                'specialty' => $request->string('specialty')->value() ?: null,
            ],
        ]);
    }

    /**
     * Show an employee's profile.
     */
    public function show(Employee $employee): Response
    {
        $employee->load([
            'candidate.credentials.verifier:id,name',
            'candidate.credentials.expiryNotifications',
            'application.jobListing:id,title',
        ]);

        return Inertia::render('admin/employees/show', [
            'employee' => $employee,
        ]);
    }
}
