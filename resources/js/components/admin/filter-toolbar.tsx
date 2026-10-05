import { Search, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

/**
 * The grouped filter-bar card introduced on the Asset Manager page —
 * whatever mix of status buttons, Selects, and search a given list page
 * needs is composed as children; this just supplies the shared card
 * layout rather than a rigid, configuration-driven filter API.
 */
export function AdminFilterToolbar({
    children,
    trailing,
}: {
    children: ReactNode;
    trailing?: ReactNode;
}) {
    return (
        <div className="mb-4 flex flex-col gap-3 rounded-xl border border-border bg-card p-3 sm:flex-row sm:flex-wrap sm:items-center">
            <div className="flex flex-wrap items-center gap-2">{children}</div>
            {trailing && (
                <div className="flex items-center gap-2 sm:ml-auto">
                    {trailing}
                </div>
            )}
        </div>
    );
}

export function ToolbarSearchInput({
    value,
    onChange,
    placeholder = 'Search...',
    className,
}: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}) {
    return (
        <div className={cn('relative flex-1 sm:max-w-xs', className)}>
            <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="pl-8"
            />
        </div>
    );
}

export function ClearFiltersButton({ onClick }: { onClick: () => void }) {
    return (
        <Button
            size="sm"
            variant="ghost"
            onClick={onClick}
            className="text-muted-foreground"
        >
            <X className="size-4" />
            Clear filters
        </Button>
    );
}
