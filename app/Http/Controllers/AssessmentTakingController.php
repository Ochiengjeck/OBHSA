<?php

namespace App\Http\Controllers;

use App\Http\Requests\SubmitAssessmentAttemptRequest;
use App\Models\AssessmentAttempt;
use App\Models\AssessmentResponse;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AssessmentTakingController extends Controller
{
    /**
     * Show the assessment-taking page for a candidate's emailed link.
     */
    public function show(string $token): Response|RedirectResponse
    {
        $attempt = $this->resolveAttempt($token);

        if ($attempt instanceof Response) {
            return $attempt;
        }

        if (in_array($attempt->status, ['completed', 'cancelled'], true)) {
            return to_route('assessments.thank-you');
        }

        $attempt->start();
        $attempt->load(['assessment:id,name,description', 'responses']);

        return Inertia::render('public/assessments/show', [
            'attempt' => $attempt,
            'token' => $token,
        ]);
    }

    /**
     * Submit the candidate's answers, auto-grading multiple-choice
     * responses immediately and finalizing the attempt if nothing is left
     * for a human to grade.
     */
    public function submit(SubmitAssessmentAttemptRequest $request, string $token): Response|RedirectResponse
    {
        $attempt = $this->resolveAttempt($token);

        if ($attempt instanceof Response) {
            return $attempt;
        }

        if (in_array($attempt->status, ['completed', 'cancelled'], true)) {
            return to_route('assessments.thank-you');
        }

        foreach ($request->validated('responses') as $responseData) {
            $response = AssessmentResponse::query()
                ->where('id', $responseData['id'])
                ->where('assessment_attempt_id', $attempt->id)
                ->first();

            if (! $response) {
                continue;
            }

            $response->fill([
                'selected_option' => $responseData['selected_option'] ?? null,
                'answer_text' => $responseData['answer_text'] ?? null,
            ]);

            $response->applyAutoGrade();
            $response->save();
        }

        $attempt->markSubmitted();

        $responses = $attempt->responses()->get();

        if ($responses->every(fn (AssessmentResponse $response) => $response->points_awarded !== null)) {
            $pointsPossible = (int) $responses->sum('points_possible');
            $pointsAwarded = (int) $responses->sum('points_awarded');
            $score = $pointsPossible > 0 ? (int) round($pointsAwarded / $pointsPossible * 100) : 0;

            $attempt->complete($score, $score >= $attempt->assessment->passing_score, null);
        }

        return to_route('assessments.thank-you');
    }

    public function thankYou(): Response
    {
        return Inertia::render('public/assessments/thank-you');
    }

    /**
     * Resolve a token to its attempt, or a dedicated response describing
     * why it couldn't be — never revealing whether an unknown token ever
     * existed.
     */
    private function resolveAttempt(string $token): AssessmentAttempt|Response
    {
        $attempt = AssessmentAttempt::query()->where('access_token', hash('sha256', $token))->first();

        if (! $attempt) {
            return Inertia::render('public/assessments/link-issue', ['reason' => 'invalid']);
        }

        if ($attempt->accessTokenHasExpired()) {
            return Inertia::render('public/assessments/link-issue', ['reason' => 'expired']);
        }

        return $attempt;
    }
}
