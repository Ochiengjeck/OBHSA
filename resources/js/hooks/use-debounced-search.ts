import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

/**
 * A debounced query param that round-trips to the server via Inertia's
 * router, preserving every other current filter. Mirrors the existing
 * `router.get(url, {...}, { preserveState, replace })` pattern already
 * used for the plain status-select filters elsewhere in admin. Defaults
 * to the "search" param every list page uses; pass `paramName` for a
 * differently-named debounced field (e.g. employees' "specialty").
 */
export function useDebouncedSearch(
    url: string,
    filters: Record<string, string | null | undefined>,
    delay = 300,
    paramName: string = 'search',
) {
    const [search, setSearch] = useState(filters[paramName] ?? '');
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
                { ...filtersRef.current, [paramName]: search || undefined },
                { preserveState: true, replace: true },
            );
        }, delay);

        return () => clearTimeout(timeout);
    }, [url, search, delay, paramName]);

    return { search, setSearch };
}
