<?php

namespace App\Services;

use App\Models\SiteSetting;

class EligibilityService
{
    /**
     * Whether a given US state abbreviation is inside OBHSA's current
     * service area, as configured by admins on Site Settings.
     */
    public function isServiced(?string $state): bool
    {
        if ($state === null || trim($state) === '') {
            return false;
        }

        return in_array(mb_strtoupper(trim($state)), $this->servicedStates(), true);
    }

    /**
     * @return array<int, string>
     */
    private function servicedStates(): array
    {
        return collect(explode(',', SiteSetting::get('service_area_states', 'NH') ?? 'NH'))
            ->map(fn (string $state) => mb_strtoupper(trim($state)))
            ->filter(fn (string $state) => $state !== '')
            ->values()
            ->all();
    }
}
