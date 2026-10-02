<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $application_id
 * @property int|null $interviewer_id
 * @property int|null $created_by
 * @property Carbon $scheduled_at
 * @property string $format
 * @property string|null $location_or_link
 * @property string $status
 * @property string|null $recommendation
 * @property string|null $overall_notes
 * @property Carbon|null $completed_at
 */
#[Fillable(['application_id', 'interviewer_id', 'created_by', 'scheduled_at', 'format', 'location_or_link'])]
class Interview extends Model
{
    protected function casts(): array
    {
        return [
            'scheduled_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
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
    public function interviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'interviewer_id');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * @return HasMany<InterviewQuestionResponse, $this>
     */
    public function responses(): HasMany
    {
        return $this->hasMany(InterviewQuestionResponse::class)->orderBy('position');
    }

    /**
     * Mark this interview completed with the interviewer's overall
     * recommendation. Excluded from #[Fillable] — status is only ever
     * mutated through these dedicated methods.
     */
    public function complete(string $recommendation, ?string $overallNotes): void
    {
        $this->forceFill([
            'status' => 'completed',
            'recommendation' => $recommendation,
            'overall_notes' => $overallNotes,
            'completed_at' => now(),
        ])->save();
    }

    /**
     * Mark this interview cancelled.
     */
    public function cancel(): void
    {
        $this->forceFill(['status' => 'cancelled'])->save();
    }

    /**
     * Mark this interview as a no-show.
     */
    public function markNoShow(): void
    {
        $this->forceFill(['status' => 'no_show'])->save();
    }

    /**
     * Reopen a completed/cancelled/no-show interview back to scheduled.
     */
    public function reschedule(): void
    {
        $this->forceFill([
            'status' => 'scheduled',
            'recommendation' => null,
            'overall_notes' => null,
            'completed_at' => null,
        ])->save();
    }
}
