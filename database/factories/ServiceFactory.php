<?php

namespace Database\Factories;

use App\Models\Service;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Service>
 */
class ServiceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->unique()->randomElement([
            'Per-Diem Staffing',
            'Travel Nursing Placement',
            'Facility Partnerships',
            'Credentialing & Compliance Support',
            'Long-Term Care Staffing',
            'Rapid Response Coverage',
        ]);

        return [
            'slug' => Str::slug($title),
            'title' => $title,
            'summary' => fake()->sentence(12),
            'description' => fake()->paragraphs(2, true),
            'icon' => null,
            'image_path' => null,
            'position' => 0,
            'is_active' => true,
        ];
    }
}
