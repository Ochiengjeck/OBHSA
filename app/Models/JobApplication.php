<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int|null $job_listing_id
 * @property string $full_name
 * @property string $email
 * @property string $phone
 * @property string $resume_path
 * @property string|null $cover_note
 * @property string $status
 * @property int|null $reviewed_by
 * @property Carbon|null $reviewed_at
 */
#[Fillable(['job_listing_id', 'full_name', 'email', 'phone', 'resume_path', 'cover_note'])]
class JobApplication extends Model
{
    protected function casts(): array
    {
        return [
            'reviewed_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<JobListing, $this>
     */
    public function jobListing(): BelongsTo
    {
        return $this->belongsTo(JobListing::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
