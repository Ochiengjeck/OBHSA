import { Check, Loader2, Wrench, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { CopilotActionEntry } from '@/types/copilot';

const STATUS_META: Record<
    string,
    { label: string; badgeClassName: string; accentClassName: string }
> = {
    pending_confirmation: {
        label: 'Needs confirmation',
        badgeClassName:
            'border-amber-400 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
        accentClassName: 'border-l-amber-400',
    },
    confirmed: {
        label: 'Running',
        badgeClassName:
            'border-blue-400 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
        accentClassName: 'border-l-blue-400',
    },
    executed: {
        label: 'Done',
        badgeClassName:
            'border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400',
        accentClassName: 'border-l-emerald-400',
    },
    failed: {
        label: 'Failed',
        badgeClassName: 'border-destructive bg-destructive/10 text-destructive',
        accentClassName: 'border-l-destructive',
    },
    rejected: {
        label: 'Rejected',
        badgeClassName: 'border-border bg-muted text-muted-foreground',
        accentClassName: 'border-l-border',
    },
};

function toolLabel(name: string): string {
    return name
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function formatValue(value: unknown): string {
    if (value === null || value === undefined) {
        return '—';
    }

    if (typeof value === 'string') {
        return value;
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
        return value.toString();
    }

    return JSON.stringify(value) ?? '—';
}

function KeyValueList({ data }: { data: Record<string, unknown> }) {
    const entries = Object.entries(data);

    if (entries.length === 0) {
        return null;
    }

    return (
        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
            {entries.map(([key, value]) => (
                <div
                    className="col-span-2 grid grid-cols-[auto_1fr] gap-x-3"
                    key={key}
                >
                    <dt className="text-muted-foreground">{key}</dt>
                    <dd className="truncate font-mono text-foreground">
                        {formatValue(value)}
                    </dd>
                </div>
            ))}
        </dl>
    );
}

export function CopilotToolCallCard({
    action,
    onConfirm,
    onReject,
}: {
    action: CopilotActionEntry;
    onConfirm?: () => void;
    onReject?: () => void;
}) {
    const meta = STATUS_META[action.status] ?? STATUS_META.pending_confirmation;
    const isPending = action.status === 'pending_confirmation';

    return (
        <Card className={cn('border-l-4 py-4', meta.accentClassName)}>
            <CardContent className="space-y-3 px-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                            <Wrench className="size-3.5" />
                        </div>
                        <span className="text-sm font-medium text-foreground">
                            {toolLabel(action.tool_name)}
                        </span>
                    </div>
                    <Badge variant="outline" className={meta.badgeClassName}>
                        {action.status === 'confirmed' && (
                            <Loader2 className="size-3 animate-spin" />
                        )}
                        {meta.label}
                    </Badge>
                </div>

                <KeyValueList data={action.arguments} />

                {action.result && (
                    <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">
                            Result
                        </p>
                        <div className="rounded-lg border border-border/60 bg-muted/60 p-2.5">
                            <KeyValueList data={action.result} />
                        </div>
                    </div>
                )}

                {isPending && onConfirm && onReject && (
                    <div className="space-y-2 border-t border-border/60 pt-3">
                        <p className="text-xs text-muted-foreground">
                            This action requires your approval before it runs.
                        </p>
                        <div className="flex gap-3">
                            <Button size="sm" onClick={onConfirm}>
                                <Check className="size-4" />
                                Confirm
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={onReject}
                            >
                                <X className="size-4" />
                                Reject
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
