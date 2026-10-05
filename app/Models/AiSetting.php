<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Spatie\Permission\Traits\HasPermissions;

/**
 * Singleton row (one per app) holding admin-configurable overrides for the
 * AI copilot: which provider is active, a per-provider API key override
 * (encrypted — this takes precedence over the provider's env/config key
 * when set), and — via HasPermissions — the Spatie permission set the AI
 * itself has been granted, checked the same way a Role's or User's
 * permissions are.
 *
 * @property int $id
 * @property string|null $provider
 * @property string|null $claude_api_key
 * @property string|null $gemini_api_key
 * @property string|null $xai_api_key
 */
#[Fillable(['provider', 'claude_api_key', 'gemini_api_key', 'xai_api_key'])]
class AiSetting extends Model
{
    use HasPermissions;

    protected string $guard_name = 'web';

    protected function casts(): array
    {
        return [
            'claude_api_key' => 'encrypted',
            'gemini_api_key' => 'encrypted',
            'xai_api_key' => 'encrypted',
        ];
    }

    /**
     * The single settings row, creating it with all-defaults on first use.
     */
    public static function current(): self
    {
        return static::query()->first() ?? static::query()->create([]);
    }

    /**
     * This provider's API key override, or null if none is set (meaning
     * its env/config key should be used instead).
     */
    public function apiKeyFor(string $provider): ?string
    {
        return match ($provider) {
            'claude' => $this->claude_api_key,
            'gemini' => $this->gemini_api_key,
            'xai' => $this->xai_api_key,
            default => null,
        };
    }

    /**
     * Whether the AI may act on $permission (null = no permission
     * applies, always allowed). Before an admin has ever granted it any
     * permission at all, the AI is unrestricted — a fresh install can
     * use the whole system immediately rather than starting fully locked
     * out with nothing to configure yet. The moment at least one
     * permission is granted, that explicit set becomes authoritative —
     * the same sync semantics a Role's permissions already have.
     *
     * Checked via hasDirectPermission() rather than hasPermissionTo():
     * AiSetting only ever gets permissions directly (it has no roles),
     * and hasPermissionTo()'s role-check path unconditionally calls
     * hasRole(), which only HasRoles (not HasPermissions alone) provides.
     */
    public function hasGrantedPermission(?string $permission): bool
    {
        if ($permission === null) {
            return true;
        }

        return $this->permissions()->count() === 0 || $this->hasDirectPermission($permission);
    }
}
