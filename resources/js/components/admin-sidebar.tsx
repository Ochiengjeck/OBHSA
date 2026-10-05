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
    HardDrive,
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
    ShieldCheck,
    Sparkles,
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
                permission: 'job-listings.view',
            },
            {
                title: 'Applications',
                href: admin.jobApplications.index(),
                icon: Inbox,
                permission: 'applications.view',
                badgeKey: 'applications',
            },
            {
                title: 'Interviews',
                href: admin.interviews.index(),
                icon: CalendarClock,
                permission: 'interviews.view',
            },
            {
                title: 'Interview Questions',
                href: admin.interviewQuestions.index(),
                icon: ClipboardList,
                permission: 'interview-questions.view',
            },
            {
                title: 'Assessments',
                href: admin.assessments.index(),
                icon: ClipboardCheck,
                permission: 'assessments.view',
            },
            {
                title: 'Assessment Attempts',
                href: admin.assessmentAttempts.index(),
                icon: ClipboardList,
                permission: 'assessment-attempts.view',
            },
            {
                title: 'Message Templates',
                href: admin.communicationTemplates.index(),
                icon: MessageCircle,
                permission: 'communication-templates.view',
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
                permission: 'employees.view',
            },
            {
                title: 'Onboarding Checklists',
                href: admin.onboardingChecklistTemplates.index(),
                icon: ListTodo,
                permission: 'onboarding.view',
            },
            {
                title: 'Compliance',
                href: admin.compliance.index(),
                icon: ShieldAlert,
                permission: 'compliance.view',
                badgeKey: 'compliance',
            },
            {
                title: 'Policy Documents',
                href: admin.policyDocuments.index(),
                icon: FileText,
                permission: 'policy-documents.view',
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
                permission: 'facilities.view',
            },
            {
                title: 'Staffing Requests',
                href: admin.staffingRequests.index(),
                icon: Mail,
                permission: 'staffing-requests.view',
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
                permission: 'pages.view',
            },
            {
                title: 'Services',
                href: admin.services.index(),
                icon: Briefcase,
                permission: 'services.view',
            },
            {
                title: 'Blog Posts',
                href: admin.blogPosts.index(),
                icon: Newspaper,
                permission: 'blog-posts.view',
            },
            {
                title: 'Testimonials',
                href: admin.testimonials.index(),
                icon: MessageSquareQuote,
                permission: 'testimonials.view',
            },
            {
                title: 'Stats',
                href: admin.stats.index(),
                icon: BarChart3,
                permission: 'stats.view',
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
                permission: 'site-settings.view',
            },
            {
                title: 'Users',
                href: admin.users.index(),
                icon: Users,
                permission: 'users.view',
            },
            {
                title: 'Roles',
                href: admin.roles.index(),
                icon: ShieldCheck,
                permission: 'roles.view',
            },
            {
                title: 'AI Settings',
                href: admin.aiSettings.index(),
                icon: Sparkles,
                permission: 'ai-settings.view',
            },
            {
                title: 'Asset Manager',
                href: admin.assets.index(),
                icon: HardDrive,
                permission: 'assets.view',
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
                {visibleGroups.map((group, index) => (
                    <NavMain
                        key={group.label}
                        items={group.items}
                        label={group.label}
                        className={
                            index > 0
                                ? 'border-t border-sidebar-border pt-2'
                                : undefined
                        }
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
