<?php

namespace App\Models;

use Database\Factories\JobListingFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $title
 * @property string $slug
 * @property string $specialty
 * @property string $employment_type
 * @property string $location_city
 * @property string $location_state
 * @property string|null $shift
 * @property string|null $pay_range_min
 * @property string|null $pay_range_max
 * @property string $description
 * @property string|null $requirements
 * @property bool $is_active
 */
#[Fillable([
    'title', 'slug', 'specialty', 'employment_type', 'location_city', 'location_state',
    'shift', 'pay_range_min', 'pay_range_max', 'description', 'requirements',
    'is_active', 'posted_at', 'closes_at',
])]
class JobListing extends Model
{
    /** @use HasFactory<JobListingFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'pay_range_min' => 'decimal:2',
            'pay_range_max' => 'decimal:2',
            'posted_at' => 'datetime',
            'closes_at' => 'datetime',
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
     * @param  Builder<JobListing>  $query
     * @return Builder<JobListing>
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }
}
