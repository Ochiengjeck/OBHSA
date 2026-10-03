import { usePage } from '@inertiajs/react';

/**
 * Resolves an uploaded file's stored relative path (e.g. `pages/abc.jpg`)
 * into a renderable URL, using the public disk's resolved URL root shared
 * from the backend — `/storage` locally, the real bucket URL once
 * production switches to S3/R2 — rather than a hardcoded prefix.
 */
export function useStorageUrl() {
    const { storageUrl } = usePage().props;

    return (path: string | null | undefined): string | null =>
        path ? `${storageUrl}/${path}` : null;
}
