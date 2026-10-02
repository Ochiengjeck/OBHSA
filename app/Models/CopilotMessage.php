<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
}
