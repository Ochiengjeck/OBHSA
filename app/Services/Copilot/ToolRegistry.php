<?php

namespace App\Services\Copilot;

use App\Models\AiSetting;
use App\Services\Copilot\Contracts\CopilotTool;
use Illuminate\Contracts\Container\Container;
use Illuminate\Support\Collection;

class ToolRegistry
{
    public function __construct(private readonly Container $container) {}

    /**
     * Every registered copilot tool currently enabled for the AI to use,
     * per the admin-granted permissions on AiSetting. A tool whose
     * required permission can't yet be resolved from no arguments (e.g.
     * a resource-parameterized tool) stays visible here — the real gate
     * for those is enforced per-call once arguments are known.
     *
     * @return Collection<int, CopilotTool>
     */
    public function all(): Collection
    {
        $setting = AiSetting::current();

        return collect($this->container->tagged('copilot.tools'))
            ->filter(fn (CopilotTool $tool) => $setting->hasGrantedPermission($tool->requiredPermission([])))
            ->values();
    }

    public function find(string $name): ?CopilotTool
    {
        return $this->all()->first(fn (CopilotTool $tool) => $tool->name() === $name);
    }
}
