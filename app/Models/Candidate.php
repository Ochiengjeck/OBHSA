<?php

namespace App\Models;

use Database\Factories\CandidateFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $full_name
 * @property string|null $first_name
 * @property string|null $last_name
 * @property string|null $preferred_name
 * @property string $email
 * @property string|null $phone
 * @property Carbon|null $date_of_birth
 * @property string|null $address_line1
 * @property string|null $address_line2
 * @property string|null $city
 * @property string|null $state
 * @property string|null $postal_code
 * @property string $country
 * @property string|null $timezone
 * @property Carbon|null $contact_verified_at
 * @property string|null $source
 */
#[Fillable([
    'full_name', 'first_name', 'last_name', 'preferred_name', 'email', 'phone', 'date_of_birth',
    'address_line1', 'address_line2', 'city', 'state', 'postal_code', 'country', 'timezone', 'source',
])]
class Candidate extends Model
{
    /** @use HasFactory<CandidateFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date',
            'contact_verified_at' => 'datetime',
        ];
    }

    /**
     * @return HasMany<Application, $this>
     */
    public function applications(): HasMany
    {
        return $this->hasMany(Application::class);
    }

    /**
     * @return HasMany<Credential, $this>
     */
    public function credentials(): HasMany
    {
        return $this->hasMany(Credential::class);
    }

    /**
     * @return HasMany<Document, $this>
     */
    public function documents(): HasMany
    {
        return $this->hasMany(Document::class);
    }

    /**
     * @return HasMany<EmploymentHistory, $this>
     */
    public function employmentHistory(): HasMany
    {
        return $this->hasMany(EmploymentHistory::class);
    }

    /**
     * @return HasMany<Education, $this>
     */
    public function education(): HasMany
    {
        return $this->hasMany(Education::class);
    }
}
