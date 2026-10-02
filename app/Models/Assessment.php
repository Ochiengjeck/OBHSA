<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $name
 * @property string|null $description
 * @property string $delivery_mode
 * @property int $passing_score
 * @property int $max_attempts
 * @property bool $is_active
 */
#[Fillable(['name', 'description', 'delivery_mode', 'passing_score', 'max_attempts', 'is_active'])]
class Assessment extends Model
{
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    /**
     * @return HasMany<AssessmentQuestion, $this>
     */
    public function questions(): HasMany
    {
        return $this->hasMany(AssessmentQuestion::class)->orderBy('position');
    }

    /**
     * @return HasMany<AssessmentAttempt, $this>
     */
    public function attempts(): HasMany
    {
        return $this->hasMany(AssessmentAttempt::class);
    }
}
