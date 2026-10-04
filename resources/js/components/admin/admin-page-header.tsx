import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export function AdminPageHeader({
    title,
    description,
    icon: Icon,
    stats,
    action,
}: {
    title: string;
    description?: string;
    icon?: LucideIcon;
    stats?: { label: string; value: string | number }[];
    action?: ReactNode;
}) {
    return (
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-3">
                {Icon && (
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="size-5" />
                    </div>
                )}
                <div className="space-y-0.5">
                    <h1 className="text-xl font-semibold tracking-tight">
                        {title}
                    </h1>
                    {description && (
                        <p className="text-sm text-muted-foreground">
                            {description}
                        </p>
                    )}
                    {stats && stats.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1.5">
                            {stats.map((stat) => (
                                <span
                                    key={stat.label}
                                    className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                                >
                                    <span className="font-semibold text-foreground tabular-nums">
                                        {stat.value}
                                    </span>
                                    {stat.label}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {action}
        </div>
    );
}
