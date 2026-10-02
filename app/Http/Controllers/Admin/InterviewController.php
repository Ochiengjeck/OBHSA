<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreInterviewRequest;
use App\Http\Requests\Admin\UpdateInterviewRequest;
use App\Models\Application;
use App\Models\Interview;
use App\Models\InterviewQuestion;
use App\Models\InterviewQuestionResponse;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InterviewController extends Controller
{
    /**
     * List all interviews, optionally filtered by interviewer or status.
     */
    public function index(Request $request): Response
    {
        $interviews = Interview::query()
            ->with(['application.candidate:id,full_name', 'interviewer:id,name'])
            ->when($request->filled('interviewer_id'), fn ($query) => $query->where('interviewer_id', $request->integer('interviewer_id')))
            ->when($request->filled('status'), fn ($query) => $query->where('status', $request->string('status')))
            ->latest('scheduled_at')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('admin/interviews/index', [
            'interviews' => $interviews,
            'filters' => [
                'interviewer_id' => $request->integer('interviewer_id') ?: null,
                'status' => $request->string('status')->value() ?: null,
            ],
            'interviewers' => User::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    /**
     * Schedule a new interview for an application, snapshotting the
     * current question bank that matches its specialty.
     */
    public function store(StoreInterviewRequest $request, Application $application): RedirectResponse
    {
        $interview = $application->interviews()->create([
            ...$request->validated(),
            'created_by' => $request->user()->id,
        ]);

        $questions = InterviewQuestion::query()
            ->where('is_active', true)
            ->where(fn ($query) => $query->whereNull('specialty')->orWhere('specialty', $application->primary_specialty))
            ->orderBy('position')
            ->get();

        foreach ($questions as $index => $question) {
            $interview->responses()->create([
                'interview_question_id' => $question->id,
                'question_text' => $question->question,
                'position' => $index,
            ]);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Interview scheduled.')]);

        return to_route('admin.candidates.show', $application->candidate_id);
    }

    /**
     * Show an interview's scoring workspace.
     */
    public function show(Interview $interview): Response
    {
        $interview->load([
            'responses',
            'application.candidate:id,full_name,email',
            'interviewer:id,name',
        ]);

        return Inertia::render('admin/interviews/show', [
            'interview' => $interview,
            'interviewers' => User::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    /**
     * Update an interview's scheduling details, question scores, and
     * overall outcome.
     */
    public function update(UpdateInterviewRequest $request, Interview $interview): RedirectResponse
    {
        $interview->update($request->safe()->only(['scheduled_at', 'interviewer_id', 'format', 'location_or_link']));

        foreach ($request->validated('responses') as $response) {
            InterviewQuestionResponse::query()
                ->where('id', $response['id'])
                ->where('interview_id', $interview->id)
                ->update([
                    'score' => $response['score'] ?? null,
                    'notes' => $response['notes'] ?? null,
                ]);
        }

        match ($request->validated('status')) {
            'completed' => $interview->complete($request->validated('recommendation'), $request->validated('overall_notes')),
            'cancelled' => $interview->cancel(),
            'no_show' => $interview->markNoShow(),
            default => $interview->reschedule(),
        };

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Interview updated.')]);

        return to_route('admin.interviews.show', $interview);
    }
}
