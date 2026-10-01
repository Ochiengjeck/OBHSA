<?php

namespace Database\Factories;

use App\Models\Testimonial;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Testimonial>
 */
class TestimonialFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'author_name' => fake()->name(),
            'author_role' => fake()->randomElement([
                'RN, Per-Diem Caregiver',
                'CNA, Per-Diem Caregiver',
                'LPN, Per-Diem Caregiver',
                'Director of Nursing, Partner Facility',
                'Staffing Coordinator, Partner Facility',
            ]),
            'author_photo_path' => null,
            'quote' => fake()->paragraph(3),
            'rating' => 5,
            'is_featured' => true,
            'position' => 0,
        ];
    }
}
