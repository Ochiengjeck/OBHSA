<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property int $user_id
 * @property string|null $title
 */
#[Fillable(['user_id', 'title'])]
class CopilotConversation extends Model
{
    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return HasMany<CopilotMessage, $this>
     */
    public function messages(): HasMany
    {
        return $this->hasMany(CopilotMessage::class)->oldest();
    }

    /**
     * @return HasMany<CopilotAction, $this>
     */
    public function actions(): HasMany
    {
        return $this->hasMany(CopilotAction::class);
    }
}
