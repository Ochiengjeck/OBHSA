<?php

namespace App\Concerns;

use Illuminate\Http\UploadedFile;
use RuntimeException;

trait StoresUploadedFiles
{
    /**
     * Store an uploaded file on the public disk, returning its relative path.
     */
    protected function storePublicFile(UploadedFile $file, string $directory): string
    {
        $path = $file->store($directory, 'public');

        if ($path === false) {
            throw new RuntimeException('Failed to store uploaded file.');
        }

        return $path;
    }
}
