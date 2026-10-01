<?php

namespace App\Models;

use Database\Factories\StatFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $label
 * @property string $value
 * @property string|null $icon
 * @property int $position
 * @property bool $is_active
 */
#[Fillable(['label', 'value', 'icon', 'position', 'is_active'])]
class Stat extends Model
{
    /** @use HasFactory<StatFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }
}
