<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $question
 * @property string|null $specialty
 * @property bool $is_active
 * @property int $position
 */
#[Fillable(['question', 'specialty', 'is_active', 'position'])]
class InterviewQuestion extends Model
{
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }
}
