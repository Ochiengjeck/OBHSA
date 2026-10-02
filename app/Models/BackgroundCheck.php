<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $application_id
 * @property string $provider
 * @property string $status
 * @property Carbon $initiated_at
 * @property Carbon|null $result_received_at
 * @property string|null $notes
 * @property int|null $initiated_by
 * @property int|null $resolved_by
 */
#[Fillable(['application_id', 'provider', 'initiated_at', 'initiated_by'])]
class BackgroundCheck extends Model
{
    protected function casts(): array
    {
        return [
            'initiated_at' => 'datetime',
            'result_received_at' => 'datetime',
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
    public function initiatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'initiated_by');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function resolvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'resolved_by');
    }

    /**
     * Record the background check's result.
     */
    public function recordResult(string $status, ?string $notes, User $resolvedBy): void
    {
        $this->forceFill([
            'status' => $status,
            'notes' => $notes,
            'result_received_at' => now(),
            'resolved_by' => $resolvedBy->id,
        ])->save();
    }

    /**
     * Cancel this background check.
     */
    public function cancel(): void
    {
        $this->forceFill(['status' => 'cancelled'])->save();
    }
}
