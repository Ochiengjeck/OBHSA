<?php

namespace App\Concerns;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
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

    /**
     * Resolve the stored path for a file field that supports upload, replace,
     * and explicit clear-to-null — deleting the previous file whenever it's
     * superseded or cleared.
     *
     * A submitted path is only ever the untouched current value or empty:
     * the frontend never lets a user type an arbitrary path, and browsers
     * cannot send a literal null over multipart/form-data (Inertia's
     * forceFormData serializes JS null/undefined as ''). So an empty
     * submitted value reliably means "no file should remain", whether that's
     * because one was never set or was just cleared.
     */
    protected function resolveReplaceablePath(?UploadedFile $file, ?string $submittedPath, ?string $previousPath, string $directory): ?string
    {
        if ($file) {
            if (! empty($previousPath)) {
                Storage::disk('public')->delete($previousPath);
            }

            return $this->storePublicFile($file, $directory);
        }

        if (empty($submittedPath)) {
            if (! empty($previousPath)) {
                Storage::disk('public')->delete($previousPath);
            }

            return null;
        }

        return $previousPath;
    }
}
