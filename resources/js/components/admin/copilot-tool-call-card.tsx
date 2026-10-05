import { Check, Loader2, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { CopilotActionEntry } from '@/types/copilot';

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
    pending_confirmation: {
        label: 'Needs confirmation',
        className:
            'border-amber-400 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
    },
    confirmed: {
        label: 'Running',
        className:
            'border-blue-400 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
    },
    executed: {
        label: 'Done',
        className:
            'border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400',
    },
    failed: {
        label: 'Failed',
        className: 'border-destructive bg-destructive/10 text-destructive',
    },
    rejected: {
        label: 'Rejected',
        className: 'border-border bg-muted text-muted-foreground',
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
    const status =
        STATUS_BADGE[action.status] ?? STATUS_BADGE.pending_confirmation;
    const isPending = action.status === 'pending_confirmation';

    return (
        <Card className={isPending ? 'border-amber-400' : undefined}>
            <CardContent className="space-y-3 pt-6">
                <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className={status.className}>
                        {action.status === 'confirmed' && (
                            <Loader2 className="size-3 animate-spin" />
                        )}
                        {status.label}
                    </Badge>
                    <span className="text-sm font-medium text-foreground">
                        {toolLabel(action.tool_name)}
                    </span>
                </div>

                <KeyValueList data={action.arguments} />

                {action.result && (
                    <div className="rounded-md bg-muted p-2">
                        <KeyValueList data={action.result} />
                    </div>
                )}

                {isPending && onConfirm && onReject && (
                    <div className="flex gap-3">
                        <Button size="sm" onClick={onConfirm}>
                            <Check className="size-4" />
                            Confirm
                        </Button>
                        <Button size="sm" variant="outline" onClick={onReject}>
                            <X className="size-4" />
                            Reject
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
