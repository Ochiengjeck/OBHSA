<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property string $facility_name
 * @property string $contact_name
 * @property string $email
 * @property string $phone
 * @property string|null $facility_type
 * @property string|null $staffing_needs
 * @property string $status
 * @property int|null $handled_by
 * @property string|null $notes
 */
#[Fillable(['facility_name', 'contact_name', 'email', 'phone', 'facility_type', 'staffing_needs'])]
class StaffingRequest extends Model
{
    /**
     * @return BelongsTo<User, $this>
     */
    public function handler(): BelongsTo
    {
        return $this->belongsTo(User::class, 'handled_by');
    }
}
