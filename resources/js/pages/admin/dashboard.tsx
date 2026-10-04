import { Head, Link } from '@inertiajs/react';
import {
    AlertTriangle,
    Award,
    CalendarClock,
    Clock,
    FileCheck,
    Inbox,
    LayoutGrid,
    ListChecks,
    Mail,
    Newspaper,
    ShieldAlert,
    UserCog,
} from 'lucide-react';
import type { ComponentType } from 'react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { EmptyState } from '@/components/admin/empty-state';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import admin from '@/routes/admin';

type Counts = {
    newApplications: number;
    newLeads: number;
    activeJobListings: number;
    publishedPosts: number;
    interviewsThisWeek: number;
    offersExpiringSoon: number;
    credentialsExpiringSoon: number;
    openShifts: number;
};

type PipelineStage = { status: string; label: string; count: number };

type NeedsAttentionType =
    | 'stalled_application'
    | 'expiring_credential'
    | 'expiring_offer'
    | 'new_staffing_request';

type NeedsAttentionItem = {
    type: NeedsAttentionType;
    title: string;
    subtitle: string;
    href: string;
    urgency: number;
};

type UpcomingInterview = {
    id: number;
    candidateName: string;
    jobTitle: string | null;
    scheduledAt: string;
};

const NEEDS_ATTENTION_ICONS: Record<
    NeedsAttentionType,
    ComponentType<{ className?: string }>
> = {
    stalled_application: Clock,
    expiring_credential: Award,
    expiring_offer: FileCheck,
    new_staffing_request: Mail,
};

export default function Dashboard({
    counts,
    pipeline,
    needsAttention,
    upcomingInterviews,
}: {
    counts: Counts;
    pipeline: PipelineStage[];
    needsAttention: NeedsAttentionItem[];
    upcomingInterviews: UpcomingInterview[];
}) {
    const cards = [
        {
            label: 'New Applications',
            value: counts.newApplications,
            href: admin.jobApplications.index(),
            icon: Inbox,
        },
        {
            label: 'New Staffing Leads',
            value: counts.newLeads,
            href: admin.staffingRequests.index(),
            icon: Mail,
        },
        {
            label: 'Active Job Listings',
            value: counts.activeJobListings,
            href: admin.jobListings.index(),
            icon: ListChecks,
        },
        {
            label: 'Published Posts',
            value: counts.publishedPosts,
            href: admin.blogPosts.index(),
            icon: Newspaper,
        },
        {
            label: 'Interviews This Week',
            value: counts.interviewsThisWeek,
            href: admin.interviews.index(),
            icon: CalendarClock,
        },
        {
            label: 'Offers Expiring Soon',
            value: counts.offersExpiringSoon,
            href: admin.jobApplications.index(),
            icon: FileCheck,
        },
        {
            label: 'Credentials Expiring',
            value: counts.credentialsExpiringSoon,
            href: admin.compliance.index(),
            icon: ShieldAlert,
        },
        {
            label: 'Open Shifts',
            value: counts.openShifts,
            href: admin.facilities.index(),
            icon: UserCog,
        },
    ];

    const maxPipelineCount = Math.max(
        1,
        ...pipeline.map((stage) => stage.count),
    );

    return (
        <>
            <Head title="Dashboard" />
            <div className="p-4 sm:p-6">
                <AdminPageHeader
                    title="Dashboard"
                    description="Overview of OBHSA backoffice activity."
                    icon={LayoutGrid}
                />

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {cards.map((card) => (
                        <Link key={card.label} href={card.href}>
                            <Card className="transition-shadow hover:shadow-md">
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
                                        {card.label}
                                        <card.icon className="size-4 text-primary" />
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-3xl font-bold text-foreground tabular-nums">
                                        {card.value}
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Application Pipeline</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {pipeline.every((stage) => stage.count === 0) ? (
                            <p className="text-sm text-muted-foreground">
                                No applications in the pipeline right now.
                            </p>
                        ) : (
                            <div className="space-y-2.5">
                                {pipeline.map((stage) => (
                                    <Link
                                        key={stage.status}
                                        href={
                                            admin.jobApplications.index({
                                                query: { status: stage.status },
                                            }).url
                                        }
                                        className="group block"
                                    >
                                        <div className="mb-1 flex items-center justify-between text-xs">
                                            <span className="font-medium text-foreground group-hover:text-primary">
                                                {stage.label}
                                            </span>
                                            <span className="text-muted-foreground tabular-nums">
                                                {stage.count}
                                            </span>
                                        </div>
                                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                                            <div
                                                className="h-full rounded-full bg-primary/70 transition-all group-hover:bg-primary"
                                                style={{
                                                    width: `${Math.max(2, (stage.count / maxPipelineCount) * 100)}%`,
                                                }}
                                            />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="mt-6 grid gap-6 lg:grid-cols-3">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Needs Attention</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {needsAttention.length === 0 ? (
                                <EmptyState
                                    icon={AlertTriangle}
                                    title="Nothing needs attention"
                                    description="Stalled applications, expiring credentials and offers, and new leads will show up here."
                                />
                            ) : (
                                <ul className="divide-y divide-border">
                                    {needsAttention.map((item, index) => {
                                        const Icon =
                                            NEEDS_ATTENTION_ICONS[item.type];

                                        return (
                                            <li key={index}>
                                                <Link
                                                    href={item.href}
                                                    className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                                                >
                                                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                                                        <Icon className="size-4" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-sm font-medium text-foreground">
                                                            {item.title}
                                                        </p>
                                                        <p className="truncate text-xs text-muted-foreground">
                                                            {item.subtitle}
                                                        </p>
                                                    </div>
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Upcoming Interviews</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {upcomingInterviews.length === 0 ? (
                                <EmptyState
                                    icon={CalendarClock}
                                    title="No interviews scheduled"
                                    description="Upcoming interviews will show up here."
                                />
                            ) : (
                                <ul className="divide-y divide-border">
                                    {upcomingInterviews.map((interview) => (
                                        <li key={interview.id}>
                                            <Link
                                                href={
                                                    admin.interviews.show(
                                                        interview.id,
                                                    ).url
                                                }
                                                className="block py-3 first:pt-0 last:pb-0"
                                            >
                                                <p className="truncate text-sm font-medium text-foreground">
                                                    {interview.candidateName}
                                                </p>
                                                <p className="truncate text-xs text-muted-foreground">
                                                    {interview.jobTitle ??
                                                        'General application'}
                                                </p>
                                                <p className="mt-0.5 text-xs text-primary">
                                                    {new Date(
                                                        interview.scheduledAt,
                                                    ).toLocaleString(
                                                        undefined,
                                                        {
                                                            weekday: 'short',
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: 'numeric',
                                                            minute: '2-digit',
                                                        },
                                                    )}
                                                </p>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: admin.dashboard() }],
};
