<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreAssessmentRequest;
use App\Http\Requests\Admin\UpdateAssessmentRequest;
use App\Models\Assessment;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AssessmentController extends Controller
{
    /**
     * List all assessments.
     */
    public function index(): Response
    {
        return Inertia::render('admin/assessments/index', [
            'assessments' => Assessment::query()->withCount('questions')->orderBy('name')->get(),
        ]);
    }

    /**
     * Show the form to create a new assessment.
     */
    public function create(): Response
    {
        return Inertia::render('admin/assessments/create');
    }

    /**
     * Store a new assessment.
     */
    public function store(StoreAssessmentRequest $request): RedirectResponse
    {
        $assessment = Assessment::query()->create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Assessment created.')]);

        return to_route('admin.assessments.questions.index', $assessment);
    }

    /**
     * Show the form to edit an assessment.
     */
    public function edit(Assessment $assessment): Response
    {
        return Inertia::render('admin/assessments/edit', [
            'assessment' => $assessment,
        ]);
    }

    /**
     * Update an assessment.
     */
    public function update(UpdateAssessmentRequest $request, Assessment $assessment): RedirectResponse
    {
        $assessment->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Assessment updated.')]);

        return to_route('admin.assessments.index');
    }

    /**
     * Delete an assessment.
     */
    public function destroy(Assessment $assessment): RedirectResponse
    {
        $assessment->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Assessment deleted.')]);

        return to_route('admin.assessments.index');
    }
}
