import { Link, usePage } from '@inertiajs/react';
import {
    BarChart3,
    Briefcase,
    ExternalLink,
    FileText,
    Inbox,
    LayoutGrid,
    ListChecks,
    Mail,
    MessageSquareQuote,
    Newspaper,
    Settings2,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import admin from '@/routes/admin';
import { home } from '@/routes';
import type { Auth, NavItem } from '@/types';

type AdminNavItem = NavItem & { permission?: string };

const mainNavItems: AdminNavItem[] = [
    { title: 'Dashboard', href: admin.dashboard(), icon: LayoutGrid },
    {
        title: 'Site Settings',
        href: admin.siteSettings.index(),
        icon: Settings2,
        permission: 'manage-site-settings',
    },
    {
        title: 'Pages',
        href: admin.pages.index(),
        icon: FileText,
        permission: 'manage-pages',
    },
    {
        title: 'Services',
        href: admin.services.index(),
        icon: Briefcase,
        permission: 'manage-services',
    },
    {
        title: 'Job Listings',
        href: admin.jobListings.index(),
        icon: ListChecks,
        permission: 'manage-jobs',
    },
    {
        title: 'Applications',
        href: admin.jobApplications.index(),
        icon: Inbox,
        permission: 'manage-applications',
    },
    {
        title: 'Blog Posts',
        href: admin.blogPosts.index(),
        icon: Newspaper,
        permission: 'manage-blog',
    },
    {
        title: 'Testimonials',
        href: admin.testimonials.index(),
        icon: MessageSquareQuote,
        permission: 'manage-testimonials',
    },
    {
        title: 'Stats',
        href: admin.stats.index(),
        icon: BarChart3,
        permission: 'manage-stats',
    },
    {
        title: 'Staffing Requests',
        href: admin.staffingRequests.index(),
        icon: Mail,
        permission: 'manage-leads',
    },
    {
        title: 'Users',
        href: admin.users.index(),
        icon: Users,
        permission: 'manage-users',
    },
];

const footerNavItems: NavItem[] = [
    { title: 'View Site', href: home(), icon: ExternalLink },
];

export function AdminSidebar() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const permissions = auth.permissions ?? [];

    const visibleItems = mainNavItems.filter(
        (item) => !item.permission || permissions.includes(item.permission),
    );

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={admin.dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={visibleItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
