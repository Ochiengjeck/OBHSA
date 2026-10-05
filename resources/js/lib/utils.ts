import type { InertiaLinkProps } from '@inertiajs/react';
import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}

export function formatBytes(bytes: number): string {
    if (bytes <= 0) {
        return '0 B';
    }

    const units = ['B', 'KB', 'MB', 'GB'];
    const exponent = Math.min(
        Math.floor(Math.log(bytes) / Math.log(1024)),
        units.length - 1,
    );
    const value = bytes / 1024 ** exponent;

    return `${exponent === 0 ? value : value.toFixed(1)} ${units[exponent]}`;
}

/**
 * A left-border + tinted-background accent for a table row that needs
 * attention (e.g. a legacy asset safe to delete, an overdue credential, a
 * stalled application) — the same treatment introduced on the Asset
 * Manager page, extracted so every list page can flag a row the same way.
 */
export function rowAccentClass(tone: 'amber' | 'red' | null): string {
    if (tone === 'amber') {
        return 'border-l-2 border-l-amber-400 bg-amber-50/40 dark:bg-amber-500/5';
    }

    if (tone === 'red') {
        return 'border-l-2 border-l-red-400 bg-red-50/40 dark:bg-red-500/5';
    }

    return '';
}
