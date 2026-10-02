<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreAssessmentAttemptRequest;
use App\Http\Requests\Admin\UpdateAssessmentAttemptRequest;
use App\Mail\AssessmentInvitation;
use App\Models\Application;
use App\Models\Assessment;
use App\Models\AssessmentAttempt;
use App\Models\AssessmentResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class AssessmentAttemptController extends Controller
{
    /**
     * List all assessment attempts, optionally filtered by assessment or
     * status. Filtering by "submitted" is effectively the needs-grading
     * queue.
     */
    public function index(Request $request): Response
    {
        $attempts = AssessmentAttempt::query()
            ->with(['assessment:id,name', 'application.candidate:id,full_name'])
            ->when($request->filled('assessment_id'), fn ($query) => $query->where('assessment_id', $request->integer('assessment_id')))
            ->when($request->filled('status'), fn ($query) => $query->where('status', $request->string('status')))
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('admin/assessment-attempts/index', [
            'attempts' => $attempts,
            'filters' => [
                'assessment_id' => $request->integer('assessment_id') ?: null,
                'status' => $request->string('status')->value() ?: null,
            ],
            'assessments' => Assessment::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    /**
     * Assign an assessment to an application: snapshot its question bank
     * into a new attempt, then either email a self-service link or send
     * the recruiter straight to the entry screen to administer it.
     */
    public function store(StoreAssessmentAttemptRequest $request, Application $application): RedirectResponse
    {
        $assessment = Assessment::query()->where('id', $request->validated('assessment_id'))->firstOrFail();

        $attemptCount = AssessmentAttempt::query()
            ->where('assessment_id', $assessment->id)
            ->where('application_id', $application->id)
            ->count();

        abort_if($attemptCount >= $assessment->max_attempts, 422, __('Maximum attempts reached for this assessment.'));

        $attempt = AssessmentAttempt::query()->create([
            'assessment_id' => $assessment->id,
            'application_id' => $application->id,
            'attempt_number' => $attemptCount + 1,
        ]);

        foreach ($assessment->questions as $index => $question) {
            $attempt->responses()->create([
                'assessment_question_id' => $question->id,
                'question_text' => $question->question,
                'question_type' => $question->question_type,
                'options' => $question->options,
                'correct_option' => $question->correct_option,
                'points_possible' => $question->points,
                'position' => $index,
            ]);
        }

        if ($assessment->delivery_mode === 'self_service') {
            $plaintext = $attempt->issueAccessToken();

            Mail::to($application->candidate->email)->queue(new AssessmentInvitation($attempt, $plaintext));

            Inertia::flash('toast', ['type' => 'success', 'message' => __('Assessment assigned and invitation sent.')]);

            return to_route('admin.candidates.show', $application->candidate_id);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Assessment attempt created.')]);

        return to_route('admin.assessment-attempts.show', $attempt);
    }

    /**
     * Show the entry/grading screen for an attempt.
     */
    public function show(AssessmentAttempt $assessmentAttempt): Response
    {
        $assessmentAttempt->load([
            'assessment',
            'application.candidate:id,full_name,email',
            'responses',
            'administeredBy:id,name',
        ]);

        return Inertia::render('admin/assessment-attempts/show', [
            'attempt' => $assessmentAttempt,
        ]);
    }

    /**
     * Fill in (if staff-administered) and/or grade an attempt's responses,
     * then finalize its score and pass/fail outcome.
     */
    public function update(UpdateAssessmentAttemptRequest $request, AssessmentAttempt $assessmentAttempt): RedirectResponse
    {
        if ($request->validated('status') === 'cancelled') {
            $assessmentAttempt->cancel();

            Inertia::flash('toast', ['type' => 'success', 'message' => __('Assessment attempt cancelled.')]);

            return to_route('admin.candidates.show', $assessmentAttempt->application->candidate_id);
        }

        foreach ($request->validated('responses') as $responseData) {
            $response = AssessmentResponse::query()
                ->where('id', $responseData['id'])
                ->where('assessment_attempt_id', $assessmentAttempt->id)
                ->first();

            if (! $response) {
                continue;
            }

            $response->fill([
                'selected_option' => $responseData['selected_option'] ?? $response->selected_option,
                'answer_text' => $responseData['answer_text'] ?? $response->answer_text,
            ]);

            $response->applyAutoGrade();

            if ($response->question_type === 'short_answer' && array_key_exists('points_awarded', $responseData)) {
                $response->points_awarded = $responseData['points_awarded'];
            }

            $response->save();
        }

        $assessmentAttempt->markSubmitted();

        $responses = $assessmentAttempt->responses()->get();
        $pointsPossible = (int) $responses->sum('points_possible');
        $pointsAwarded = (int) $responses->sum('points_awarded');
        $score = $pointsPossible > 0 ? (int) round($pointsAwarded / $pointsPossible * 100) : 0;

        $assessmentAttempt->complete($score, $score >= $assessmentAttempt->assessment->passing_score, $request->user());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Assessment attempt completed.')]);

        return to_route('admin.candidates.show', $assessmentAttempt->application->candidate_id);
    }
}
