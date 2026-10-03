import apply from '@/routes/apply';

export type ApplyStepKey =
    | 'contact'
    | 'location'
    | 'preferences'
    | 'employment-history'
    | 'education'
    | 'documents'
    | 'consent'
    | 'review';

export type ApplyStepDef = {
    key: ApplyStepKey;
    label: string;
    href: string;
};

/**
 * The single source of truth for the apply wizard's step order, labels,
 * and routes — used by both the progress tracker and each step page, so
 * the two can never drift out of sync.
 */
export const APPLY_STEPS: ApplyStepDef[] = [
    { key: 'contact', label: 'Contact', href: apply.create().url },
    { key: 'location', label: 'Location', href: apply.location.edit().url },
    {
        key: 'preferences',
        label: 'Preferences',
        href: apply.preferences.edit().url,
    },
    {
        key: 'employment-history',
        label: 'Experience',
        href: apply.employmentHistory.edit().url,
    },
    {
        key: 'education',
        label: 'Education',
        href: apply.education.edit().url,
    },
    {
        key: 'documents',
        label: 'Documents',
        href: apply.documents.edit().url,
    },
    { key: 'consent', label: 'Consent', href: apply.consent.edit().url },
    { key: 'review', label: 'Review', href: apply.review().url },
];

export function applyStepIndex(key: ApplyStepKey): number {
    return APPLY_STEPS.findIndex((step) => step.key === key);
}
