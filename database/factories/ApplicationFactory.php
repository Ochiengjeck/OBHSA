<?php

namespace Database\Factories;

use App\Enums\ApplicationStatus;
use App\Models\Application;
use App\Models\Candidate;
use App\Models\JobListing;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Application>
 */
class ApplicationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'candidate_id' => Candidate::factory(),
            'job_listing_id' => JobListing::factory(),
            'cover_note' => fake()->sentence(15),
            'source' => 'public_form',
        ];
    }

    /**
     * Indicate that the application has been submitted.
     */
    public function submitted(): static
    {
        return $this->afterCreating(function (Application $application) {
            $application->transitionTo(ApplicationStatus::Submitted, actor: null, reasonCode: 'factory');
        });
    }
}
