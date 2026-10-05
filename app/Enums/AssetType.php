<?php

namespace App\Enums;

enum AssetType: string
{
    case Image = 'image';
    case Document = 'document';
    case Other = 'other';

    public static function fromExtension(string $extension): self
    {
        return match (strtolower($extension)) {
            'jpg', 'jpeg', 'png', 'webp', 'gif', 'svg' => self::Image,
            'pdf', 'doc', 'docx' => self::Document,
            default => self::Other,
        };
    }

    public function label(): string
    {
        return match ($this) {
            self::Image => 'Image',
            self::Document => 'Document',
            self::Other => 'Other',
        };
    }
}
