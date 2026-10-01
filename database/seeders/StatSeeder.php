<?php

namespace Database\Seeders;

use App\Models\Stat;
use Illuminate\Database\Seeder;

class StatSeeder extends Seeder
{
    /**
     * Seed the homepage trust-stat counters.
     */
    public function run(): void
    {
        $stats = [
            ['label' => 'Caregivers Placed', 'value' => '1,200+'],
            ['label' => 'Partner Facilities', 'value' => '85+'],
            ['label' => 'Shift Fill Rate', 'value' => '98%'],
            ['label' => 'Support Availability', 'value' => '24/7'],
        ];

        foreach ($stats as $position => $stat) {
            Stat::query()->updateOrCreate(
                ['label' => $stat['label']],
                [...$stat, 'icon' => null, 'position' => $position, 'is_active' => true],
            );
        }
    }
}
