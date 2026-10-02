<?php

namespace Database\Seeders;

use App\Enums\ApplicationStatus;
use App\Models\Application;
use App\Models\Candidate;
use App\Models\JobListing;
use App\Models\StaffingRequest;
use Illuminate\Database\Seeder;

class DemoSubmissionSeeder extends Seeder
{
    /**
     * Requirement types seeded alongside each demo application, mirroring
     * JobApplicationIntakeService's initial checklist.
     *
     * @var list<string>
     */
    private const array INITIAL_REQUIREMENTS = [
        'contact_verification',
        'eligibility_screen',
        'recruiter_review',
    ];

    /**
     * Seed a handful of demo job applications and staffing-request leads
     * so the backoffice index pages aren't empty on first look.
     */
    public function run(): void
    {
        if (Application::query()->count() === 0) {
            JobListing::query()->inRandomOrder()->take(3)->get()->each(function (JobListing $listing): void {
                $candidate = Candidate::query()->create([
                    'full_name' => fake()->name(),
                    'email' => fake()->unique()->safeEmail(),
                    'phone' => fake()->numerify('(603) ###-####'),
                    'source' => 'demo_seed',
                ]);

                $application = Application::query()->create([
                    'candidate_id' => $candidate->id,
                    'job_listing_id' => $listing->id,
                    'cover_note' => fake()->sentence(20),
                    'source' => 'demo_seed',
                ]);

                $application->documents()->create([
                    'candidate_id' => $candidate->id,
                    'document_type' => 'resume',
                    'disk' => 'public',
                    'file_path' => 'resumes/demo-resume.pdf',
                    'original_filename' => 'demo-resume.pdf',
                    'mime_type' => 'application/pdf',
                    'file_size' => 0,
                    'uploaded_at' => now(),
                ]);

                foreach (self::INITIAL_REQUIREMENTS as $requirementType) {
                    $application->requirements()->create(['requirement_type' => $requirementType]);
                }

                $application->transitionTo(ApplicationStatus::Submitted, actor: null, reasonCode: 'demo_seed');
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
