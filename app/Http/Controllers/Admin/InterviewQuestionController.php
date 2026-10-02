<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreInterviewQuestionRequest;
use App\Http\Requests\Admin\UpdateInterviewQuestionRequest;
use App\Models\InterviewQuestion;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class InterviewQuestionController extends Controller
{
    /**
     * List all interview questions.
     */
    public function index(): Response
    {
        return Inertia::render('admin/interview-questions/index', [
            'questions' => InterviewQuestion::query()->orderBy('position')->orderBy('id')->get(),
        ]);
    }

    /**
     * Show the form to create a new interview question.
     */
    public function create(): Response
    {
        return Inertia::render('admin/interview-questions/create');
    }

    /**
     * Store a new interview question.
     */
    public function store(StoreInterviewQuestionRequest $request): RedirectResponse
    {
        InterviewQuestion::query()->create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Question created.')]);

        return to_route('admin.interview-questions.index');
    }

    /**
     * Show the form to edit an interview question.
     */
    public function edit(InterviewQuestion $interviewQuestion): Response
    {
        return Inertia::render('admin/interview-questions/edit', [
            'question' => $interviewQuestion,
        ]);
    }

    /**
     * Update an interview question.
     */
    public function update(UpdateInterviewQuestionRequest $request, InterviewQuestion $interviewQuestion): RedirectResponse
    {
        $interviewQuestion->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Question updated.')]);

        return to_route('admin.interview-questions.index');
    }

    /**
     * Delete an interview question.
     */
    public function destroy(InterviewQuestion $interviewQuestion): RedirectResponse
    {
        $interviewQuestion->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Question deleted.')]);

        return to_route('admin.interview-questions.index');
    }
}
