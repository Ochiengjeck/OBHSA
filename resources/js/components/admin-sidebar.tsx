import { Link, usePage } from '@inertiajs/react';
import {
    BarChart3,
    Bot,
    Briefcase,
    Building2,
    CalendarClock,
    ClipboardCheck,
    ClipboardList,
    ExternalLink,
    FileText,
    Inbox,
    LayoutGrid,
    ListChecks,
    ListTodo,
    Mail,
    MessageCircle,
    MessageSquareQuote,
    Newspaper,
    Settings2,
    ShieldAlert,
    UserCheck,
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

type AdminNavItem = NavItem & {
    permission?: string;
    badgeKey?: AdminNavBadgeKey;
};
type AdminNavBadgeKey = 'applications' | 'staffingRequests' | 'compliance';
type AdminNavGroup = { label: string; items: AdminNavItem[] };

const navGroups: AdminNavGroup[] = [
    {
        label: 'Overview',
        items: [
            { title: 'Dashboard', href: admin.dashboard(), icon: LayoutGrid },
            { title: 'Copilot', href: admin.copilot.index(), icon: Bot },
        ],
    },
    {
        label: 'Recruiting',
        items: [
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
                badgeKey: 'applications',
            },
            {
                title: 'Interviews',
                href: admin.interviews.index(),
                icon: CalendarClock,
                permission: 'manage-applications',
            },
            {
                title: 'Interview Questions',
                href: admin.interviewQuestions.index(),
                icon: ClipboardList,
                permission: 'manage-applications',
            },
            {
                title: 'Assessments',
                href: admin.assessments.index(),
                icon: ClipboardCheck,
                permission: 'manage-applications',
            },
            {
                title: 'Assessment Attempts',
                href: admin.assessmentAttempts.index(),
                icon: ClipboardList,
                permission: 'manage-applications',
            },
            {
                title: 'Message Templates',
                href: admin.communicationTemplates.index(),
                icon: MessageCircle,
                permission: 'manage-applications',
            },
        ],
    },
    {
        label: 'Workforce',
        items: [
            {
                title: 'Employees',
                href: admin.employees.index(),
                icon: UserCheck,
                permission: 'manage-applications',
            },
            {
                title: 'Onboarding Checklists',
                href: admin.onboardingChecklistTemplates.index(),
                icon: ListTodo,
                permission: 'manage-applications',
            },
            {
                title: 'Compliance',
                href: admin.compliance.index(),
                icon: ShieldAlert,
                permission: 'manage-applications',
                badgeKey: 'compliance',
            },
            {
                title: 'Policy Documents',
                href: admin.policyDocuments.index(),
                icon: FileText,
                permission: 'manage-applications',
            },
        ],
    },
    {
        label: 'Operations',
        items: [
            {
                title: 'Facilities',
                href: admin.facilities.index(),
                icon: Building2,
                permission: 'manage-applications',
            },
            {
                title: 'Staffing Requests',
                href: admin.staffingRequests.index(),
                icon: Mail,
                permission: 'manage-leads',
                badgeKey: 'staffingRequests',
            },
        ],
    },
    {
        label: 'Content',
        items: [
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
        ],
    },
    {
        label: 'Settings',
        items: [
            {
                title: 'Site Settings',
                href: admin.siteSettings.index(),
                icon: Settings2,
                permission: 'manage-site-settings',
            },
            {
                title: 'Users',
                href: admin.users.index(),
                icon: Users,
                permission: 'manage-users',
            },
        ],
    },
];

const footerNavItems: NavItem[] = [
    { title: 'View Site', href: home(), icon: ExternalLink },
];

export function AdminSidebar() {
    const { auth, adminNavBadges } = usePage<{
        auth: Auth;
        adminNavBadges: Record<AdminNavBadgeKey, number> | null;
    }>().props;
    const permissions = auth.permissions ?? [];

    const visibleGroups = navGroups
        .map((group) => ({
            ...group,
            items: group.items
                .filter(
                    (item) =>
                        !item.permission ||
                        permissions.includes(item.permission),
                )
                .map((item) => ({
                    ...item,
                    badge: item.badgeKey
                        ? adminNavBadges?.[item.badgeKey]
                        : undefined,
                })),
        }))
        .filter((group) => group.items.length > 0);

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
                {visibleGroups.map((group) => (
                    <NavMain
                        key={group.label}
                        items={group.items}
                        label={group.label}
                    />
                ))}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
