<?php

namespace App\Services\Copilot\Tools\Concerns;

use App\Models\User;

/**
 * For a tool whose required permission never depends on its arguments —
 * most tools, which each touch one fixed resource/action.
 */
trait AuthorizesViaPermission
{
    abstract protected function permission(): string;

    public function requiredPermission(array $arguments): ?string
    {
        return $this->permission();
    }

    public function authorize(User $user, array $arguments): bool
    {
        return $user->can($this->permission());
    }
}
