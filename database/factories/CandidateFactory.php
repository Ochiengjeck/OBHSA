<?php

namespace Database\Factories;

use App\Models\Candidate;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Candidate>
 */
class CandidateFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'full_name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'phone' => fake()->numerify('(603) ###-####'),
            'city' => fake()->randomElement(['Manchester', 'Nashua', 'Concord', 'Derry', 'Salem']),
            'state' => 'NH',
            'country' => 'US',
            'source' => 'public_form',
        ];
    }
}
