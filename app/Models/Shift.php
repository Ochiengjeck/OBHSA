<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $facility_id
 * @property string $specialty
 * @property Carbon $shift_date
 * @property string $start_time
 * @property string $end_time
 * @property int $slots_needed
 * @property string|null $pay_rate
 * @property string $status
 * @property string|null $notes
 * @property int|null $created_by
 */
#[Fillable([
    'facility_id', 'specialty', 'shift_date', 'start_time', 'end_time',
    'slots_needed', 'pay_rate', 'notes', 'created_by',
])]
class Shift extends Model
{
    protected function casts(): array
    {
        return [
            'shift_date' => 'date',
        ];
    }

    /**
     * @return BelongsTo<Facility, $this>
     */
    public function facility(): BelongsTo
    {
        return $this->belongsTo(Facility::class);
    }

    /**
     * @return HasMany<ShiftAssignment, $this>
     */
    public function assignments(): HasMany
    {
        return $this->hasMany(ShiftAssignment::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Cancel this shift entirely (staff decided not to run it).
     */
    public function cancel(): void
    {
        $this->forceFill(['status' => 'cancelled'])->save();
    }

    /**
     * Recompute this shift's open/filled status from its active
     * assignments. A cancelled shift never reopens automatically.
     */
    public function recomputeStatus(): void
    {
        if ($this->status === 'cancelled') {
            return;
        }

        $activeAssignments = $this->assignments()
            ->whereIn('status', ['assigned', 'confirmed', 'completed'])
            ->count();

        $this->forceFill([
            'status' => $activeAssignments >= $this->slots_needed ? 'filled' : 'open',
        ])->save();
    }
}
