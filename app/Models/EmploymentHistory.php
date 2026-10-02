<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $candidate_id
 * @property string $employer_name
 * @property string $job_title
 * @property string|null $employment_type
 * @property string|null $city
 * @property string|null $state
 * @property string|null $country
 * @property Carbon $start_date
 * @property Carbon|null $end_date
 * @property bool $is_current
 * @property string|null $responsibilities
 * @property string|null $supervisor_name
 * @property string|null $supervisor_contact
 * @property string|null $reason_for_leaving
 */
#[Fillable([
    'candidate_id', 'employer_name', 'job_title', 'employment_type', 'city', 'state', 'country',
    'start_date', 'end_date', 'is_current', 'responsibilities', 'supervisor_name',
    'supervisor_contact', 'reason_for_leaving',
])]
class EmploymentHistory extends Model
{
    protected $table = 'employment_history';

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'is_current' => 'boolean',
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
     * @return HasMany<ReferenceCheck, $this>
     */
    public function referenceChecks(): HasMany
    {
        return $this->hasMany(ReferenceCheck::class)->latest('contacted_at');
    }
}
