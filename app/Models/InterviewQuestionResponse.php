<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $interview_id
 * @property int|null $interview_question_id
 * @property string $question_text
 * @property int|null $score
 * @property string|null $notes
 * @property int $position
 */
#[Fillable(['interview_id', 'interview_question_id', 'question_text', 'score', 'notes', 'position'])]
class InterviewQuestionResponse extends Model
{
    /**
     * @return BelongsTo<Interview, $this>
     */
    public function interview(): BelongsTo
    {
        return $this->belongsTo(Interview::class);
    }

    /**
     * @return BelongsTo<InterviewQuestion, $this>
     */
    public function question(): BelongsTo
    {
        return $this->belongsTo(InterviewQuestion::class, 'interview_question_id');
    }
}
