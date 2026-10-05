import type { ReactNode } from 'react';

/**
 * A bold primary line with a muted secondary line underneath, optionally
 * led by an avatar/thumbnail — the name+email, candidate+position, etc.
 * treatment already hand-rolled on several index pages, extracted into
 * one shared cell.
 */
export function TwoLineCell({
    avatar,
    primary,
    secondary,
}: {
    avatar?: ReactNode;
    primary: ReactNode;
    secondary?: ReactNode;
}) {
    return (
        <div className="flex items-center gap-3">
            {avatar}
            <div className="min-w-0">
                <p className="truncate font-medium text-foreground">
                    {primary}
                </p>
                {secondary && (
                    <p className="truncate text-xs text-muted-foreground">
                        {secondary}
                    </p>
                )}
            </div>
        </div>
    );
}
