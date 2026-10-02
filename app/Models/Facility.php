<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $name
 * @property string $address_line1
 * @property string $city
 * @property string $state
 * @property string $postal_code
 * @property string|null $contact_name
 * @property string|null $contact_phone
 * @property string|null $contact_email
 * @property string $facility_type
 * @property bool $is_active
 */
#[Fillable([
    'name', 'address_line1', 'city', 'state', 'postal_code',
    'contact_name', 'contact_phone', 'contact_email', 'facility_type', 'is_active',
])]
class Facility extends Model
{
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    /**
     * @return HasMany<Shift, $this>
     */
    public function shifts(): HasMany
    {
        return $this->hasMany(Shift::class)->latest('shift_date');
    }
}
