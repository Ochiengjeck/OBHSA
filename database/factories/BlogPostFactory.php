<?php

namespace Database\Factories;

use App\Models\BlogPost;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<BlogPost>
 */
class BlogPostFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->unique()->sentence(6);
        $publishedAt = now()->subDays(fake()->numberBetween(1, 180));

        return [
            'title' => rtrim($title, '.'),
            'slug' => Str::slug($title),
            'excerpt' => fake()->sentence(18),
            'body' => fake()->paragraphs(6, true),
            'featured_image_path' => null,
            'author_id' => null,
            'is_published' => true,
            'published_at' => $publishedAt,
        ];
    }
}
