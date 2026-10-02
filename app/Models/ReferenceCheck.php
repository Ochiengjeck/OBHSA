<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * Immutable log of reference-check calls against a candidate's employment
 * history. Rows are only ever created, never updated.
 *
 * @property int $id
 * @property int $employment_history_id
 * @property string $contact_method
 * @property Carbon $contacted_at
 * @property string $outcome
 * @property string|null $notes
 * @property int|null $checked_by
 */
#[Fillable(['employment_history_id', 'contact_method', 'contacted_at', 'outcome', 'notes', 'checked_by'])]
class ReferenceCheck extends Model
{
    protected function casts(): array
    {
        return [
            'contacted_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<EmploymentHistory, $this>
     */
    public function employmentHistory(): BelongsTo
    {
        return $this->belongsTo(EmploymentHistory::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function checkedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'checked_by');
    }
}
