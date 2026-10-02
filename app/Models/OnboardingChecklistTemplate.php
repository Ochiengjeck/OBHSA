<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $name
 * @property string|null $description
 * @property bool $is_default
 * @property bool $is_active
 */
#[Fillable(['name', 'description', 'is_default', 'is_active'])]
class OnboardingChecklistTemplate extends Model
{
    protected function casts(): array
    {
        return [
            'is_default' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    /**
     * @return HasMany<OnboardingChecklistTemplateItem, $this>
     */
    public function items(): HasMany
    {
        return $this->hasMany(OnboardingChecklistTemplateItem::class)->orderBy('position');
    }
}
