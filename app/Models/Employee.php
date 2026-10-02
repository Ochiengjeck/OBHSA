<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $candidate_id
 * @property int|null $application_id
 * @property string|null $employee_number
 * @property Carbon $hire_date
 * @property string $status
 * @property string|null $specialty
 * @property string|null $pay_rate
 * @property Carbon|null $terminated_at
 * @property string|null $termination_reason
 */
#[Fillable(['candidate_id', 'application_id', 'hire_date', 'specialty', 'pay_rate'])]
class Employee extends Model
{
    protected function casts(): array
    {
        return [
            'hire_date' => 'date',
            'terminated_at' => 'datetime',
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
     * @return BelongsTo<Application, $this>
     */
    public function application(): BelongsTo
    {
        return $this->belongsTo(Application::class);
    }

    /**
     * Assign this employee's number now that it has an id. Called once,
     * right after creation.
     */
    public function assignEmployeeNumber(): void
    {
        if ($this->employee_number === null) {
            $this->forceFill(['employee_number' => 'EMP-'.str_pad((string) $this->id, 5, '0', STR_PAD_LEFT)])->save();
        }
    }

    /**
     * Terminate this employee's employment.
     */
    public function terminate(?string $reason = null): void
    {
        $this->forceFill([
            'status' => 'terminated',
            'terminated_at' => now(),
            'termination_reason' => $reason,
        ])->save();
    }
}
