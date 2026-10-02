<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $candidate_id
 * @property int|null $application_id
 * @property string $document_type
 * @property string $disk
 * @property string $file_path
 * @property string $original_filename
 * @property string $mime_type
 * @property int $file_size
 * @property int $version
 * @property string $status
 * @property int|null $supersedes_document_id
 * @property string|null $verification_notes
 * @property int|null $uploaded_by
 * @property Carbon $uploaded_at
 */
#[Fillable([
    'candidate_id', 'application_id', 'document_type', 'disk', 'file_path', 'original_filename',
    'mime_type', 'file_size', 'version', 'supersedes_document_id', 'uploaded_by', 'uploaded_at',
])]
class Document extends Model
{
    protected function casts(): array
    {
        return [
            'uploaded_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<Candidate, $this>
     */
    public function candidate(): BelongsTo
    {
        return $this->belongsTo(Candidate::class);
    }

    /**
     * @return BelongsTo<Application, $this>
     */
    public function application(): BelongsTo
    {
        return $this->belongsTo(Application::class);
    }

    /**
     * @return BelongsTo<Document, $this>
     */
    public function supersedes(): BelongsTo
    {
        return $this->belongsTo(Document::class, 'supersedes_document_id');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
