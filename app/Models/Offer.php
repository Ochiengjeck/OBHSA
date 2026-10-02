<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property int $application_id
 * @property string $position
 * @property string $pay_rate
 * @property string $employment_type
 * @property Carbon $start_date
 * @property Carbon|null $expires_at
 * @property string $status
 * @property int|null $extended_by
 * @property Carbon|null $extended_at
 * @property Carbon|null $responded_at
 * @property string|null $decline_reason
 * @property string|null $access_token
 * @property Carbon|null $access_token_expires_at
 * @property string|null $notes
 */
#[Fillable(['application_id', 'position', 'pay_rate', 'employment_type', 'start_date', 'expires_at', 'notes', 'extended_by', 'extended_at'])]
class Offer extends Model
{
    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'expires_at' => 'datetime',
            'extended_at' => 'datetime',
            'responded_at' => 'datetime',
            'access_token_expires_at' => 'datetime',
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
    public function extendedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'extended_by');
    }

    /**
     * Generate a fresh access token, storing only its hash (same pattern as
     * Application::issueResumeToken()) and returning the plaintext for use
     * in an emailed link. Excluded from #[Fillable] since it must never be
     * settable via mass assignment.
     */
    public function issueAccessToken(): string
    {
        $plaintext = Str::random(64);

        $this->forceFill([
            'access_token' => hash('sha256', $plaintext),
            'access_token_expires_at' => $this->expires_at ?? now()->addDays(14),
        ])->save();

        return $plaintext;
    }

    /**
     * Whether this offer's access token has expired.
     */
    public function accessTokenHasExpired(): bool
    {
        return $this->access_token_expires_at !== null && $this->access_token_expires_at->isPast();
    }

    /**
     * Accept this offer.
     */
    public function accept(): void
    {
        $this->forceFill([
            'status' => 'accepted',
            'responded_at' => now(),
        ])->save();
    }

    /**
     * Decline this offer.
     */
    public function decline(?string $reason = null): void
    {
        $this->forceFill([
            'status' => 'declined',
            'responded_at' => now(),
            'decline_reason' => $reason,
        ])->save();
    }

    /**
     * Withdraw this offer (staff action — the agency pulled it back).
     */
    public function withdraw(): void
    {
        $this->forceFill(['status' => 'withdrawn'])->save();
    }
}
