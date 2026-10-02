<?php

namespace App\Models;

use App\Enums\ApplicationStatus;
use App\Exceptions\InvalidApplicationTransitionException;
use App\Support\ApplicationStateMachine;
use Database\Factories\ApplicationFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property int $candidate_id
 * @property int|null $job_listing_id
 * @property string $status
 * @property Carbon|null $current_stage_entered_at
 * @property Carbon|null $submitted_at
 * @property int|null $assigned_recruiter_id
 * @property string|null $source
 * @property string|null $cover_note
 * @property string|null $ip_address
 * @property string|null $user_agent
 * @property string|null $resume_token
 * @property Carbon|null $resume_token_expires_at
 * @property string|null $primary_specialty
 * @property string|null $secondary_specialty
 * @property string|null $desired_employment_type
 * @property string|null $desired_start_timeframe
 * @property array<int, string>|null $work_settings
 * @property Carbon|null $consent_accepted_at
 * @property string|null $consent_signature_name
 */
#[Fillable([
    'candidate_id', 'job_listing_id', 'cover_note', 'source', 'ip_address', 'user_agent',
    'primary_specialty', 'secondary_specialty', 'desired_employment_type', 'desired_start_timeframe',
    'work_settings', 'consent_accepted_at', 'consent_signature_name', 'assigned_recruiter_id',
])]
class Application extends Model
{
    /** @use HasFactory<ApplicationFactory> */
    use HasFactory, SoftDeletes;

    /**
     * In-memory default matching the `status` column's database default, so
     * a freshly created instance has a usable status before any reload.
     *
     * @var array<string, mixed>
     */
    protected $attributes = [
        'status' => 'draft',
    ];

    protected function casts(): array
    {
        return [
            'current_stage_entered_at' => 'datetime',
            'submitted_at' => 'datetime',
            'resume_token_expires_at' => 'datetime',
            'work_settings' => 'array',
            'consent_accepted_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<Candidate, $this>
     */
    public function candidate(): BelongsTo
    {
        return $this->belongsTo(Candidate::class);
    }

    /**
     * @return BelongsTo<JobListing, $this>
     */
    public function jobListing(): BelongsTo
    {
        return $this->belongsTo(JobListing::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function recruiter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_recruiter_id');
    }

    /**
     * @return HasMany<ApplicationStageHistory, $this>
     */
    public function stageHistory(): HasMany
    {
        return $this->hasMany(ApplicationStageHistory::class)->orderBy('occurred_at');
    }

    /**
     * @return HasMany<ApplicationRequirement, $this>
     */
    public function requirements(): HasMany
    {
        return $this->hasMany(ApplicationRequirement::class);
    }

    /**
     * @return HasMany<Document, $this>
     */
    public function documents(): HasMany
    {
        return $this->hasMany(Document::class);
    }

    /**
     * @return HasMany<ApplicationCommunication, $this>
     */
    public function communications(): HasMany
    {
        return $this->hasMany(ApplicationCommunication::class)->latest();
    }

    /**
     * Generate a fresh resume token, storing only its hash (mirrors
     * Laravel's own password-reset-token convention) and returning the
     * plaintext for use in an emailed link. Excluded from #[Fillable] since
     * it must never be settable via mass assignment.
     */
    public function issueResumeToken(): string
    {
        $plaintext = Str::random(64);

        $this->forceFill([
            'resume_token' => hash('sha256', $plaintext),
            'resume_token_expires_at' => now()->addDays(14),
        ])->save();

        return $plaintext;
    }

    /**
     * Whether this application's resume token has expired.
     */
    public function resumeTokenHasExpired(): bool
    {
        return $this->resume_token_expires_at !== null && $this->resume_token_expires_at->isPast();
    }

    /**
     * Move this application to a new status, validating the transition and
     * recording it in the audit history. This is the only way the status
     * column may change — it is deliberately excluded from #[Fillable].
     *
     * @param  array<string, mixed>  $metadata
     */
    public function transitionTo(
        ApplicationStatus $to,
        ?User $actor = null,
        ?string $reason = null,
        ?string $reasonCode = null,
        array $metadata = [],
    ): void {
        $from = ApplicationStatus::from($this->status);

        if (! ApplicationStateMachine::canTransition($from, $to)) {
            throw InvalidApplicationTransitionException::make($from, $to);
        }

        DB::transaction(function () use ($from, $to, $actor, $reason, $reasonCode, $metadata) {
            $this->stageHistory()->create([
                'from_status' => $from->value,
                'to_status' => $to->value,
                'changed_by' => $actor?->id,
                'reason' => $reason,
                'reason_code' => $reasonCode,
                'metadata' => $metadata,
                'occurred_at' => now(),
            ]);

            $this->forceFill([
                'status' => $to->value,
                'current_stage_entered_at' => now(),
                'submitted_at' => $to === ApplicationStatus::Submitted ? now() : $this->submitted_at,
            ])->save();
        });
    }
}
