<?php

namespace Database\Seeders;

use App\Models\Testimonial;
use Illuminate\Database\Seeder;

class TestimonialSeeder extends Seeder
{
    /**
     * Seed a mix of caregiver and facility testimonials.
     */
    public function run(): void
    {
        if (Testimonial::query()->count() > 0) {
            return;
        }

        $testimonials = [
            ['author_name' => 'Rachel M.', 'author_role' => 'RN, Per-Diem Caregiver', 'quote' => 'OBHSA lets me pick up shifts around my kids\' schedules. I finally have control over my work-life balance without giving up steady income.'],
            ['author_name' => 'Darnell P.', 'author_role' => 'CNA, Per-Diem Caregiver', 'quote' => 'The onboarding process was fast and the support team actually answers the phone. I was working my first shift within two weeks.'],
            ['author_name' => 'Susan K.', 'author_role' => 'Director of Nursing, Partner Facility', 'quote' => 'When we have a call-off, OBHSA finds us qualified coverage fast. Their caregivers show up prepared and ready to work.'],
            ['author_name' => 'Marcus T.', 'author_role' => 'LPN, Per-Diem Caregiver', 'quote' => 'I like that I can say yes to the shifts that work for me and no to the ones that don\'t. No pressure, just flexibility.'],
            ['author_name' => 'Angela R.', 'author_role' => 'Staffing Coordinator, Partner Facility', 'quote' => 'Their credentialing process gives us peace of mind. Every caregiver they send is properly licensed and verified.'],
            ['author_name' => 'James O.', 'author_role' => 'RN, Per-Diem Caregiver', 'quote' => 'OBHSA treats caregivers like professionals, not just names on a schedule. That respect makes a real difference.'],
        ];

        foreach ($testimonials as $position => $testimonial) {
            Testimonial::query()->create([
                ...$testimonial,
                'author_photo_path' => null,
                'rating' => 5,
                'is_featured' => true,
                'position' => $position,
            ]);
        }
    }
}
