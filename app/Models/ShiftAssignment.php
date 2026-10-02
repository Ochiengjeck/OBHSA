<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $shift_id
 * @property int $employee_id
 * @property string $status
 * @property Carbon $assigned_at
 * @property int|null $assigned_by
 */
#[Fillable(['shift_id', 'employee_id', 'assigned_at', 'assigned_by'])]
class ShiftAssignment extends Model
{
    protected function casts(): array
    {
        return [
            'assigned_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<Shift, $this>
     */
    public function shift(): BelongsTo
    {
        return $this->belongsTo(Shift::class);
    }

    /**
     * @return BelongsTo<Employee, $this>
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function assignedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_by');
    }

    public function confirm(): void
    {
        $this->forceFill(['status' => 'confirmed'])->save();
    }

    public function complete(): void
    {
        $this->forceFill(['status' => 'completed'])->save();
    }

    public function markNoShow(): void
    {
        $this->forceFill(['status' => 'no_show'])->save();
    }

    public function cancel(): void
    {
        $this->forceFill(['status' => 'cancelled'])->save();
    }
}
