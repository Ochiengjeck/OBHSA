import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

/**
 * A debounced "search" query param that round-trips to the server via
 * Inertia's router, preserving every other current filter. Mirrors the
 * existing `router.get(url, {...}, { preserveState, replace })` pattern
 * already used for the plain status-select filters elsewhere in admin.
 */
export function useDebouncedSearch(
    url: string,
    filters: Record<string, string | null | undefined>,
    delay = 300,
) {
    const [search, setSearch] = useState(filters.search ?? '');
    const filtersRef = useRef(filters);
    filtersRef.current = filters;
    const isFirstRun = useRef(true);

    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }

        const timeout = setTimeout(() => {
            router.get(
                url,
                { ...filtersRef.current, search: search || undefined },
                { preserveState: true, replace: true },
            );
        }, delay);

        return () => clearTimeout(timeout);
    }, [url, search, delay]);

    return { search, setSearch };
}
