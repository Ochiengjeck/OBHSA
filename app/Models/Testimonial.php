<?php

namespace App\Models;

use Database\Factories\TestimonialFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $author_name
 * @property string|null $author_role
 * @property string|null $author_photo_path
 * @property string $quote
 * @property int|null $rating
 * @property bool $is_featured
 * @property int $position
 */
#[Fillable(['author_name', 'author_role', 'author_photo_path', 'quote', 'rating', 'is_featured', 'position'])]
class Testimonial extends Model
{
    /** @use HasFactory<TestimonialFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'is_featured' => 'boolean',
            'rating' => 'integer',
        ];
    }
}
