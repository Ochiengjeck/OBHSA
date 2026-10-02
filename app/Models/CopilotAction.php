<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * The full tool-call audit log: one row per tool invocation the copilot
 * ever makes, whatever the outcome.
 *
 * @property int $id
 * @property int $copilot_conversation_id
 * @property int|null $copilot_message_id
 * @property string $tool_name
 * @property array<string, mixed> $arguments
 * @property string $status
 * @property array<string, mixed>|null $result
 * @property string $provider
 * @property int $user_id
 * @property Carbon|null $executed_at
 */
#[Fillable(['copilot_conversation_id', 'copilot_message_id', 'tool_name', 'arguments', 'provider', 'user_id'])]
class CopilotAction extends Model
{
    protected function casts(): array
    {
        return [
            'arguments' => 'array',
            'result' => 'array',
            'executed_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<CopilotConversation, $this>
     */
    public function conversation(): BelongsTo
    {
        return $this->belongsTo(CopilotConversation::class, 'copilot_conversation_id');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Mark a pending write-tool call as confirmed by the acting user, just
     * before it executes.
     */
    public function confirm(): void
    {
        $this->forceFill(['status' => 'confirmed'])->save();
    }

    /**
     * Discard a pending write-tool call the user declined to run.
     */
    public function reject(): void
    {
        $this->forceFill(['status' => 'rejected'])->save();
    }

    /**
     * @param  array<string, mixed>  $result
     */
    public function markExecuted(array $result): void
    {
        $this->forceFill(['status' => 'executed', 'result' => $result, 'executed_at' => now()])->save();
    }

    /**
     * @param  array<string, mixed>  $result
     */
    public function markFailed(array $result): void
    {
        $this->forceFill(['status' => 'failed', 'result' => $result, 'executed_at' => now()])->save();
    }
}
