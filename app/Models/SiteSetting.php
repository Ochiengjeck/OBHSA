<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

/**
 * @property int $id
 * @property string $key
 * @property string|null $value
 * @property string $type
 * @property string $group
 */
#[Fillable(['key', 'value', 'type', 'group'])]
class SiteSetting extends Model
{
    public const CACHE_KEY = 'site-settings';

    /**
     * Get a setting's value by key, from the cached key/value map.
     */
    public static function get(string $key, ?string $default = null): ?string
    {
        return static::allCached()->get($key, $default);
    }

    /**
     * Get every setting as a flat key => value map, cached.
     *
     * @return Collection<string, string|null>
     */
    public static function allCached(): Collection
    {
        /** @var array<string, string|null> $settings */
        $settings = Cache::rememberForever(
            static::CACHE_KEY,
            fn () => static::query()->get()->pluck('value', 'key')->all(),
        );

        return collect($settings);
    }

    /**
     * Set (create or update) a setting's value and flush the cache.
     */
    public static function set(string $key, ?string $value): void
    {
        static::query()->updateOrCreate(['key' => $key], ['value' => $value]);

        Cache::forget(static::CACHE_KEY);
    }

    protected static function booted(): void
    {
        static::saved(fn () => Cache::forget(static::CACHE_KEY));
        static::deleted(fn () => Cache::forget(static::CACHE_KEY));
    }
}
