<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $assessment_id
 * @property string $question
 * @property string $question_type
 * @property array<int, string>|null $options
 * @property string|null $correct_option
 * @property int $points
 * @property int $position
 */
#[Fillable(['assessment_id', 'question', 'question_type', 'options', 'correct_option', 'points', 'position'])]
class AssessmentQuestion extends Model
{
    protected function casts(): array
    {
        return [
            'options' => 'array',
        ];
    }

    /**
     * @return BelongsTo<Assessment, $this>
     */
    public function assessment(): BelongsTo
    {
        return $this->belongsTo(Assessment::class);
    }
}
