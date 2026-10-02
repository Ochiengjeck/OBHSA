<?php

namespace App\Support;

class CaregiverSpecialties
{
    /**
     * Caregiver specialty options offered on the application wizard,
     * keyed by stored value.
     *
     * @var array<string, string>
     */
    public const array OPTIONS = [
        'rn' => 'Registered Nurse (RN)',
        'lpn' => 'Licensed Practical Nurse (LPN)',
        'cna' => 'Certified Nursing Assistant (CNA)',
        'cma' => 'Certified Medication Aide (CMA)',
        'hha' => 'Home Health Aide (HHA)',
        'surgical_technologist' => 'Surgical Technologist',
        'behavioral_health_psychiatric_nurse' => 'Behavioral Health / Psychiatric Nurse',
        'other' => 'Other',
    ];

    /**
     * Whether the given value is a recognized specialty option.
     */
    public static function isValid(string $value): bool
    {
        return array_key_exists($value, self::OPTIONS);
    }
}
