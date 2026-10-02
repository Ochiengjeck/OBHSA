<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreAssessmentQuestionRequest;
use App\Http\Requests\Admin\UpdateAssessmentQuestionRequest;
use App\Models\Assessment;
use App\Models\AssessmentQuestion;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AssessmentQuestionController extends Controller
{
    /**
     * List an assessment's questions.
     */
    public function index(Assessment $assessment): Response
    {
        return Inertia::render('admin/assessments/questions/index', [
            'assessment' => $assessment,
            'questions' => $assessment->questions,
        ]);
    }

    /**
     * Show the form to add a question to an assessment.
     */
    public function create(Assessment $assessment): Response
    {
        return Inertia::render('admin/assessments/questions/create', [
            'assessment' => $assessment,
        ]);
    }

    /**
     * Store a new question for an assessment.
     */
    public function store(StoreAssessmentQuestionRequest $request, Assessment $assessment): RedirectResponse
    {
        $assessment->questions()->create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Question added.')]);

        return to_route('admin.assessments.questions.index', $assessment);
    }

    /**
     * Show the form to edit a question.
     */
    public function edit(AssessmentQuestion $question): Response
    {
        return Inertia::render('admin/assessments/questions/edit', [
            'assessment' => $question->assessment,
            'question' => $question,
        ]);
    }

    /**
     * Update a question.
     */
    public function update(UpdateAssessmentQuestionRequest $request, AssessmentQuestion $question): RedirectResponse
    {
        $question->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Question updated.')]);

        return to_route('admin.assessments.questions.index', $question->assessment_id);
    }

    /**
     * Delete a question.
     */
    public function destroy(AssessmentQuestion $question): RedirectResponse
    {
        $assessmentId = $question->assessment_id;

        $question->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Question deleted.')]);

        return to_route('admin.assessments.questions.index', $assessmentId);
    }
}
