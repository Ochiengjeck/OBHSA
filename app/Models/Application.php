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
 */
#[Fillable(['candidate_id', 'job_listing_id', 'cover_note', 'source', 'ip_address', 'user_agent'])]
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
