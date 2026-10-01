<?php

namespace Database\Seeders;

use App\Models\JobListing;
use Illuminate\Database\Seeder;

class JobListingSeeder extends Seeder
{
    /**
     * Seed a realistic spread of open OBHSA job listings.
     */
    public function run(): void
    {
        if (JobListing::query()->count() > 0) {
            return;
        }

        JobListing::factory(10)->create();
    }
}
