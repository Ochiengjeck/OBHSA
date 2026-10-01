<?php

namespace Database\Seeders;

use App\Models\BlogPost;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BlogPostSeeder extends Seeder
{
    /**
     * Seed OBHSA blog posts with on-brand titles, plus Faker-generated bodies.
     */
    public function run(): void
    {
        $titles = [
            '5 Tips for Your First Per-Diem Shift',
            'How Facilities Can Reduce Reliance on Agency Staffing',
            'Understanding NH Licensure Requirements for RNs and LPNs',
            'Why Per-Diem Work Is Growing Among Healthcare Caregivers',
            'A Facility Administrator\'s Guide to Staffing Partnerships',
            'Balancing Flexibility and Income as a Per-Diem CNA',
            'What to Look for in a Healthcare Staffing Agency',
        ];

        foreach ($titles as $index => $title) {
            BlogPost::query()->updateOrCreate(
                ['slug' => Str::slug($title)],
                [
                    'title' => $title,
                    'excerpt' => fake()->sentence(18),
                    'body' => fake()->paragraphs(6, true),
                    'featured_image_path' => null,
                    'author_id' => null,
                    'is_published' => true,
                    'published_at' => now()->subDays(($index + 1) * 12),
                ],
            );
        }
    }
}
