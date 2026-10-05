import { Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/types';

export function NavMain({
    items,
    label = 'Platform',
    className,
}: {
    items: NavItem[];
    label?: string;
    className?: string;
}) {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <SidebarGroup className={cn('px-2 py-0', className)}>
            <SidebarGroupLabel className="text-[0.65rem] font-semibold tracking-wider uppercase">
                {label}
            </SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    const active = isCurrentUrl(item.href);

                    return (
                        <SidebarMenuItem key={item.title}>
                            <span
                                aria-hidden
                                className={cn(
                                    'absolute top-1.5 bottom-1.5 left-0 z-10 w-0.5 rounded-full bg-primary transition-opacity',
                                    active ? 'opacity-100' : 'opacity-0',
                                )}
                            />
                            <SidebarMenuButton
                                asChild
                                isActive={active}
                                tooltip={{ children: item.title }}
                            >
                                <Link href={item.href} prefetch>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                    {!!item.badge && (
                                        <Badge
                                            variant="secondary"
                                            className={cn(
                                                'ml-auto h-5 min-w-5 justify-center rounded-full px-1 tabular-nums',
                                                active &&
                                                    'bg-primary/15 text-primary',
                                            )}
                                        >
                                            {item.badge}
                                        </Badge>
                                    )}
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
