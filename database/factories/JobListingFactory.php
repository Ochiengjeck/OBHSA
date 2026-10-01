<?php

namespace Database\Factories;

use App\Models\JobListing;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<JobListing>
 */
class JobListingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $specialty = fake()->randomElement(['RN', 'LPN', 'CNA', 'CMA']);
        $city = fake()->randomElement(['Manchester', 'Nashua', 'Concord', 'Derry', 'Salem', 'Dover']);
        $title = "{$specialty} - Per Diem, {$city} NH ".fake()->unique()->numerify('####');

        return [
            'title' => $title,
            'slug' => Str::slug($title),
            'specialty' => $specialty,
            'employment_type' => fake()->randomElement(['per-diem', 'prn', 'full-time', 'part-time', 'contract']),
            'location_city' => $city,
            'location_state' => 'NH',
            'shift' => fake()->randomElement(['day', 'evening', 'night', 'rotating']),
            'pay_range_min' => fake()->numberBetween(28, 40),
            'pay_range_max' => fake()->numberBetween(41, 65),
            'description' => fake()->paragraphs(3, true),
            'requirements' => fake()->paragraphs(2, true),
            'is_active' => true,
            'posted_at' => now()->subDays(fake()->numberBetween(0, 30)),
            'closes_at' => null,
        ];
    }
}
