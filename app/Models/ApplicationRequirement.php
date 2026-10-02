<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $application_id
 * @property string $requirement_type
 * @property string $status
 * @property bool $is_blocking
 * @property int|null $related_credential_id
 * @property int|null $related_document_id
 * @property int|null $assigned_to
 * @property Carbon|null $due_at
 * @property Carbon|null $completed_at
 * @property string|null $notes
 * @property array<string, mixed>|null $metadata
 */
#[Fillable([
    'application_id', 'requirement_type', 'status', 'is_blocking', 'related_credential_id',
    'related_document_id', 'assigned_to', 'due_at', 'notes', 'metadata',
])]
class ApplicationRequirement extends Model
{
    protected function casts(): array
    {
        return [
            'is_blocking' => 'boolean',
            'metadata' => 'array',
            'due_at' => 'datetime',
            'completed_at' => 'datetime',
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
     * @return BelongsTo<Credential, $this>
     */
    public function relatedCredential(): BelongsTo
    {
        return $this->belongsTo(Credential::class, 'related_credential_id');
    }

    /**
     * @return BelongsTo<Document, $this>
     */
    public function relatedDocument(): BelongsTo
    {
        return $this->belongsTo(Document::class, 'related_document_id');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    /**
     * Mark this requirement as completed (passed).
     */
    public function markComplete(): void
    {
        $this->forceFill([
            'status' => 'passed',
            'completed_at' => now(),
        ])->save();
    }
}
