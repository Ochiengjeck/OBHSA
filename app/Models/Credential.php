<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $candidate_id
 * @property string $credential_type
 * @property string $credential_name
 * @property string|null $credential_number
 * @property string|null $issuing_authority
 * @property string|null $jurisdiction
 * @property Carbon|null $issue_date
 * @property Carbon|null $expiry_date
 * @property string $verification_status
 * @property string|null $verification_source
 * @property int|null $verified_by
 * @property Carbon|null $verified_at
 * @property int|null $document_id
 * @property string|null $notes
 */
#[Fillable([
    'candidate_id', 'credential_type', 'credential_name', 'credential_number', 'issuing_authority',
    'jurisdiction', 'issue_date', 'expiry_date', 'document_id', 'notes',
])]
class Credential extends Model
{
    protected function casts(): array
    {
        return [
            'issue_date' => 'date',
            'expiry_date' => 'date',
            'verified_at' => 'datetime',
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
     * @return BelongsTo<Document, $this>
     */
    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    /**
     * @return HasMany<CredentialExpiryNotification, $this>
     */
    public function expiryNotifications(): HasMany
    {
        return $this->hasMany(CredentialExpiryNotification::class);
    }

    /**
     * Mark this credential as independently verified by an authority.
     */
    public function verify(User $verifier, string $source = 'manual_admin'): void
    {
        $this->forceFill([
            'verification_status' => 'verified',
            'verification_source' => $source,
            'verified_by' => $verifier->id,
            'verified_at' => now(),
        ])->save();
    }

    /**
     * Mark this credential as rejected during verification.
     */
    public function reject(User $reviewer, ?string $notes = null): void
    {
        $this->forceFill([
            'verification_status' => 'rejected',
            'verified_by' => $reviewer->id,
            'verified_at' => now(),
            'notes' => $notes ?? $this->notes,
        ])->save();
    }
}
