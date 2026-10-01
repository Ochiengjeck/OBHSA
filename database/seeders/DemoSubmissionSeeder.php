<?php

namespace Database\Seeders;

use App\Models\JobApplication;
use App\Models\JobListing;
use App\Models\StaffingRequest;
use Illuminate\Database\Seeder;

class DemoSubmissionSeeder extends Seeder
{
    /**
     * Seed a handful of demo job applications and staffing-request leads
     * so the backoffice index pages aren't empty on first look.
     */
    public function run(): void
    {
        if (JobApplication::query()->count() === 0) {
            JobListing::query()->inRandomOrder()->take(3)->get()->each(function (JobListing $listing): void {
                JobApplication::query()->create([
                    'job_listing_id' => $listing->id,
                    'full_name' => fake()->name(),
                    'email' => fake()->unique()->safeEmail(),
                    'phone' => fake()->numerify('(603) ###-####'),
                    'resume_path' => 'resumes/demo-resume.pdf',
                    'cover_note' => fake()->sentence(20),
                ]);
            });
        }

        if (StaffingRequest::query()->count() === 0) {
            StaffingRequest::query()->create([
                'facility_name' => 'Granite Ridge Skilled Nursing',
                'contact_name' => 'Patricia Hale',
                'email' => 'phale@example.com',
                'phone' => '(603) 555-0142',
                'facility_type' => 'Skilled Nursing Facility',
                'staffing_needs' => 'Need 2 LPNs for evening shifts, 3x per week, starting next month.',
            ]);

            StaffingRequest::query()->create([
                'facility_name' => 'Merrimack Valley Home Health',
                'contact_name' => 'Douglas Fenn',
                'email' => 'dfenn@example.com',
                'phone' => '(603) 555-0198',
                'facility_type' => 'Home Health',
                'staffing_needs' => 'Looking for per-diem CNA coverage for weekend visits.',
            ]);
        }
    }
}
