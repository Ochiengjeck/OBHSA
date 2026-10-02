<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $credential_id
 * @property string $stage
 * @property Carbon $sent_at
 * @property bool $notified_employee
 * @property bool $notified_staff
 */
#[Fillable(['credential_id', 'stage', 'sent_at', 'notified_employee', 'notified_staff'])]
class CredentialExpiryNotification extends Model
{
    protected function casts(): array
    {
        return [
            'sent_at' => 'datetime',
            'notified_employee' => 'boolean',
            'notified_staff' => 'boolean',
        ];
    }

    /**
     * @return BelongsTo<Credential, $this>
     */
    public function credential(): BelongsTo
    {
        return $this->belongsTo(Credential::class);
    }
}
