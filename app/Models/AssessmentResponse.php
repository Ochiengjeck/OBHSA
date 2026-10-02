<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * A snapshot of one question at the moment its attempt was created, so
 * later edits to the question bank never retroactively change a past
 * attempt's record.
 *
 * @property int $id
 * @property int $assessment_attempt_id
 * @property int|null $assessment_question_id
 * @property string $question_text
 * @property string $question_type
 * @property array<int, string>|null $options
 * @property string|null $correct_option
 * @property string|null $selected_option
 * @property string|null $answer_text
 * @property bool|null $is_correct
 * @property int|null $points_awarded
 * @property int $points_possible
 * @property int $position
 */
#[Fillable([
    'assessment_attempt_id', 'assessment_question_id', 'question_text', 'question_type', 'options',
    'correct_option', 'selected_option', 'answer_text', 'is_correct', 'points_awarded', 'points_possible', 'position',
])]
class AssessmentResponse extends Model
{
    protected function casts(): array
    {
        return [
            'options' => 'array',
            'is_correct' => 'boolean',
        ];
    }

    /**
     * @return BelongsTo<AssessmentAttempt, $this>
     */
    public function attempt(): BelongsTo
    {
        return $this->belongsTo(AssessmentAttempt::class, 'assessment_attempt_id');
    }

    /**
     * @return BelongsTo<AssessmentQuestion, $this>
     */
    public function question(): BelongsTo
    {
        return $this->belongsTo(AssessmentQuestion::class, 'assessment_question_id');
    }

    /**
     * Set is_correct/points_awarded from the already-set selected_option,
     * using the snapshotted correct_option — a no-op for short-answer
     * responses, which only a human can grade. Does not save.
     */
    public function applyAutoGrade(): void
    {
        if ($this->question_type !== 'multiple_choice') {
            return;
        }

        $this->is_correct = $this->selected_option !== null && $this->selected_option === $this->correct_option;
        $this->points_awarded = $this->is_correct ? $this->points_possible : 0;
    }
}
