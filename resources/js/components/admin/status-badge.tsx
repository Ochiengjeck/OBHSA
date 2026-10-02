import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const STATUS_STYLES: Record<string, string> = {
    draft: 'bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300',
    started:
        'bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300',
    submitted:
        'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300',
    new: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300',
    eligibility_review:
        'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
    recruiter_review:
        'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
    reviewing:
        'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
    contacted:
        'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
    screening:
        'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300',
    credentialing:
        'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300',
    interview:
        'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300',
    assessment:
        'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300',
    final_review:
        'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300',
    shortlisted:
        'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300',
    qualified:
        'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300',
    approved:
        'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
    offer_pending:
        'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
    offer_accepted:
        'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
    onboarding:
        'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
    activation_review:
        'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
    active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
    hired: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
    closed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
    on_hold:
        'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
    rejected: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300',
    ineligible: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300',
    expired: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300',
    withdrawn:
        'bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300',
};

export function StatusBadge({ status }: { status: string }) {
    return (
        <Badge
            variant="outline"
            className={cn(
                'border-transparent capitalize',
                STATUS_STYLES[status],
            )}
        >
            {status.replaceAll('_', ' ')}
        </Badge>
    );
}
