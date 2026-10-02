<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * Immutable audit log of application status changes. Rows are created only
 * by Application::transitionTo() — no controller ever mass-assigns these
 * from request input, so every column is safely fillable from that one
 * trusted call site; rows are never updated after creation.
 *
 * @property int $id
 * @property int $application_id
 * @property string|null $from_status
 * @property string $to_status
 * @property int|null $changed_by
 * @property string|null $reason
 * @property string|null $reason_code
 * @property array<string, mixed>|null $metadata
 * @property Carbon $occurred_at
 */
#[Fillable(['application_id', 'from_status', 'to_status', 'changed_by', 'reason', 'reason_code', 'metadata', 'occurred_at'])]
class ApplicationStageHistory extends Model
{
    protected $table = 'application_stage_history';

    public const UPDATED_AT = null;

    protected function casts(): array
    {
        return [
            'metadata' => 'array',
            'occurred_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<Application, $this>
     */
    public function application(): BelongsTo
    {
        return $this->belongsTo(Application::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function changedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'changed_by');
    }
}
