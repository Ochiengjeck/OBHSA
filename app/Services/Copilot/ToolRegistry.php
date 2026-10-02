<?php

namespace App\Services\Copilot;

use App\Services\Copilot\Contracts\CopilotTool;
use Illuminate\Contracts\Container\Container;
use Illuminate\Support\Collection;

class ToolRegistry
{
    public function __construct(private readonly Container $container) {}

    /**
     * Every registered copilot tool, resolved from the container's
     * "copilot.tools" tag.
     *
     * @return Collection<int, CopilotTool>
     */
    public function all(): Collection
    {
        return collect($this->container->tagged('copilot.tools'));
    }

    public function find(string $name): ?CopilotTool
    {
        return $this->all()->first(fn (CopilotTool $tool) => $tool->name() === $name);
    }
}
