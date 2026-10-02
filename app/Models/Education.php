<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $candidate_id
 * @property string $institution_name
 * @property string|null $credential_earned
 * @property string|null $field_of_study
 * @property Carbon|null $start_date
 * @property Carbon|null $end_date
 * @property bool $is_current
 * @property string|null $country
 * @property string|null $state
 */
#[Fillable([
    'candidate_id', 'institution_name', 'credential_earned', 'field_of_study',
    'start_date', 'end_date', 'is_current', 'country', 'state',
])]
class Education extends Model
{
    protected $table = 'education';

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
}
