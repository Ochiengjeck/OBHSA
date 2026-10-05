import { router } from '@inertiajs/react';
import type { ComponentProps, MouseEvent } from 'react';
import { TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

const INTERACTIVE_SELECTOR =
    'a, button, input, textarea, select, [role="menuitem"]';

/**
 * A table row that navigates to `href` when clicked anywhere that isn't
 * itself an interactive control (a link, button, the row-actions menu
 * trigger, a checkbox, etc.) — lets users open an item without having to
 * aim for a specific cell or open the actions menu first.
 */
export function ClickableTableRow({
    href,
    className,
    children,
    ...props
}: ComponentProps<typeof TableRow> & { href: string }) {
    function handleClick(event: MouseEvent<HTMLTableRowElement>) {
        if ((event.target as HTMLElement).closest(INTERACTIVE_SELECTOR)) {
            return;
        }

        router.visit(href);
    }

    return (
        <TableRow
            className={cn('cursor-pointer', className)}
            onClick={handleClick}
            {...props}
        >
            {children}
        </TableRow>
    );
}
