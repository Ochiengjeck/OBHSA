<?php

namespace App\Services\AssetInventory;

use App\Enums\AssetStatus;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Support\Carbon;

/**
 * One file on the public disk, classified against every known
 * resource/column that might reference it.
 *
 * @implements Arrayable<string, mixed>
 */
final readonly class AssetFile implements Arrayable
{
    public function __construct(
        public string $path,
        public int $size,
        public Carbon $lastModifiedAt,
        public AssetStatus $status,
        public ?string $usedBy,
        public bool $isImage,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'path' => $this->path,
            'size' => $this->size,
            'last_modified_at' => $this->lastModifiedAt->toIso8601String(),
            'status' => $this->status->value,
            'used_by' => $this->usedBy,
            'is_image' => $this->isImage,
        ];
    }
}
