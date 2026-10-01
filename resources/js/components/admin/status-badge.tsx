import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const STATUS_STYLES: Record<string, string> = {
    new: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300',
    reviewing:
        'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
    contacted:
        'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
    shortlisted:
        'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300',
    qualified:
        'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300',
    hired: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
    closed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
    rejected: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300',
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
            {status}
        </Badge>
    );
}
