<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            AdminUserSeeder::class,
            SiteSettingSeeder::class,
            PageSeeder::class,
            ServiceSeeder::class,
            JobListingSeeder::class,
            BlogPostSeeder::class,
            TestimonialSeeder::class,
            StatSeeder::class,
            DemoSubmissionSeeder::class,
        ]);
    }
}
