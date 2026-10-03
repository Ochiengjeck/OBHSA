<?php

namespace Database\Factories;

use App\Models\Page;
use App\Models\PageSection;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PageSection>
 */
class PageSectionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'page_id' => Page::factory(),
            'type' => 'hero',
            'position' => 0,
            'is_visible' => true,
            'content' => [
                'heading' => fake()->sentence(4),
                'subheading' => fake()->sentence(),
                'image_path' => null,
                'primary_cta_label' => 'Learn More',
                'primary_cta_url' => '/about',
                'secondary_cta_label' => null,
                'secondary_cta_url' => null,
            ],
        ];
    }

    /**
     * Configure the section as an "intro" section.
     */
    public function intro(): static
    {
        return $this->state(fn () => [
            'type' => 'intro',
            'content' => [
                'heading' => fake()->sentence(4),
                'body' => fake()->paragraph(),
            ],
        ]);
    }

    /**
     * Configure the section as a "feature_showcase" section.
     */
    public function featureShowcase(): static
    {
        return $this->state(fn () => [
            'type' => 'feature_showcase',
            'content' => [
                'heading' => fake()->sentence(4),
                'subheading' => fake()->sentence(),
                'items' => [
                    ['title' => fake()->sentence(3), 'body' => fake()->paragraph(), 'image_path' => null],
                    ['title' => fake()->sentence(3), 'body' => fake()->paragraph(), 'image_path' => null],
                ],
            ],
        ]);
    }

    /**
     * Configure the section as a "gallery" section.
     */
    public function gallery(): static
    {
        return $this->state(fn () => [
            'type' => 'gallery',
            'content' => [
                'heading' => fake()->sentence(3),
                'images' => [
                    ['image_path' => null, 'caption' => fake()->sentence()],
                    ['image_path' => null, 'caption' => fake()->sentence()],
                ],
            ],
        ]);
    }
}
