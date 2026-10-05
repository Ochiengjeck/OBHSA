<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * An immutable turn in a copilot conversation.
 *
 * @property int $id
 * @property int $copilot_conversation_id
 * @property string $role
 * @property string|null $content
 */
#[Fillable(['copilot_conversation_id', 'role', 'content'])]
class CopilotMessage extends Model
{
    /**
     * @return BelongsTo<CopilotConversation, $this>
     */
    public function conversation(): BelongsTo
    {
        return $this->belongsTo(CopilotConversation::class, 'copilot_conversation_id');
    }

    /**
     * The tool call this assistant message requested, if any.
     *
     * @return HasOne<CopilotAction, $this>
     */
    public function action(): HasOne
    {
        return $this->hasOne(CopilotAction::class, 'copilot_message_id');
    }
}
