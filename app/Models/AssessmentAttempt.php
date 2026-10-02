<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property int $assessment_id
 * @property int $application_id
 * @property int $attempt_number
 * @property string $status
 * @property int|null $score
 * @property bool|null $passed
 * @property Carbon|null $started_at
 * @property Carbon|null $submitted_at
 * @property string|null $access_token
 * @property Carbon|null $access_token_expires_at
 * @property int|null $administered_by
 */
#[Fillable(['assessment_id', 'application_id', 'attempt_number', 'administered_by'])]
class AssessmentAttempt extends Model
{
    protected function casts(): array
    {
        return [
            'passed' => 'boolean',
            'started_at' => 'datetime',
            'submitted_at' => 'datetime',
            'access_token_expires_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<Assessment, $this>
     */
    public function assessment(): BelongsTo
    {
        return $this->belongsTo(Assessment::class);
    }

    /**
     * @return BelongsTo<Application, $this>
     */
    public function application(): BelongsTo
    {
        return $this->belongsTo(Application::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function administeredBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'administered_by');
    }

    /**
     * @return HasMany<AssessmentResponse, $this>
     */
    public function responses(): HasMany
    {
        return $this->hasMany(AssessmentResponse::class, 'assessment_attempt_id')->orderBy('position');
    }

    /**
     * Generate a fresh access token, storing only its hash (same pattern as
     * Application::issueResumeToken()) and returning the plaintext for use
     * in an emailed link. Excluded from #[Fillable] since it must never be
     * settable via mass assignment.
     */
    public function issueAccessToken(): string
    {
        $plaintext = Str::random(64);

        $this->forceFill([
            'access_token' => hash('sha256', $plaintext),
            'access_token_expires_at' => now()->addDays(14),
        ])->save();

        return $plaintext;
    }

    /**
     * Whether this attempt's access token has expired.
     */
    public function accessTokenHasExpired(): bool
    {
        return $this->access_token_expires_at !== null && $this->access_token_expires_at->isPast();
    }

    /**
     * Mark that the candidate has opened the attempt.
     */
    public function start(): void
    {
        if ($this->started_at === null) {
            $this->forceFill(['started_at' => now()])->save();
        }
    }

    /**
     * Mark that the candidate has submitted their answers. The attempt
     * stays at this status until complete() finalizes it (immediately, if
     * every response is already graded, or later once a human grades any
     * remaining short-answer responses).
     */
    public function markSubmitted(): void
    {
        $this->forceFill([
            'status' => 'submitted',
            'submitted_at' => $this->submitted_at ?? now(),
        ])->save();
    }

    /**
     * Finalize this attempt with its computed score and pass/fail outcome.
     */
    public function complete(int $score, bool $passed, ?User $administeredBy): void
    {
        $this->forceFill([
            'status' => 'completed',
            'score' => $score,
            'passed' => $passed,
            'administered_by' => $administeredBy?->id,
        ])->save();
    }

    /**
     * Cancel this attempt.
     */
    public function cancel(): void
    {
        $this->forceFill(['status' => 'cancelled'])->save();
    }
}
