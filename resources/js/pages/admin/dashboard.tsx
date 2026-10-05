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
import { TwoLineCell } from '@/components/admin/two-line-cell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import admin from '@/routes/admin';

type CardTone =
    | 'blue'
    | 'violet'
    | 'amber'
    | 'emerald'
    | 'rose'
    | 'cyan'
    | 'indigo'
    | 'teal';

const CARD_TONE_CLASSES: Record<CardTone, string> = {
    blue: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300',
    violet: 'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300',
    amber: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
    emerald:
        'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
    rose: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300',
    cyan: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-300',
    indigo: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300',
    teal: 'bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300',
};

const PIPELINE_BAR_CLASSES: Record<string, string> = {
    submitted: 'bg-blue-500',
    eligibility_review: 'bg-amber-500',
    recruiter_review: 'bg-amber-500',
    screening: 'bg-violet-500',
    credentialing: 'bg-violet-500',
    interview: 'bg-violet-500',
    assessment: 'bg-violet-500',
    final_review: 'bg-violet-500',
    on_hold: 'bg-amber-500',
    offer_pending: 'bg-emerald-500',
    offer_accepted: 'bg-emerald-500',
    hired: 'bg-emerald-500',
};

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
            tone: 'blue' as const,
        },
        {
            label: 'New Staffing Leads',
            value: counts.newLeads,
            href: admin.staffingRequests.index(),
            icon: Mail,
            tone: 'cyan' as const,
        },
        {
            label: 'Active Job Listings',
            value: counts.activeJobListings,
            href: admin.jobListings.index(),
            icon: ListChecks,
            tone: 'indigo' as const,
        },
        {
            label: 'Published Posts',
            value: counts.publishedPosts,
            href: admin.blogPosts.index(),
            icon: Newspaper,
            tone: 'teal' as const,
        },
        {
            label: 'Interviews This Week',
            value: counts.interviewsThisWeek,
            href: admin.interviews.index(),
            icon: CalendarClock,
            tone: 'violet' as const,
        },
        {
            label: 'Offers Expiring Soon',
            value: counts.offersExpiringSoon,
            href: admin.jobApplications.index(),
            icon: FileCheck,
            tone: 'amber' as const,
        },
        {
            label: 'Credentials Expiring',
            value: counts.credentialsExpiringSoon,
            href: admin.compliance.index(),
            icon: ShieldAlert,
            tone: 'rose' as const,
        },
        {
            label: 'Open Shifts',
            value: counts.openShifts,
            href: admin.facilities.index(),
            icon: UserCog,
            tone: 'emerald' as const,
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
                                <CardContent className="flex items-center gap-4">
                                    <div
                                        className={cn(
                                            'flex size-11 shrink-0 items-center justify-center rounded-lg',
                                            CARD_TONE_CLASSES[card.tone],
                                        )}
                                    >
                                        <card.icon className="size-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="truncate text-xs font-medium text-muted-foreground">
                                            {card.label}
                                        </p>
                                        <p className="text-2xl font-bold text-foreground tabular-nums">
                                            {card.value}
                                        </p>
                                    </div>
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
                                                className={cn(
                                                    'h-full rounded-full opacity-80 transition-all group-hover:opacity-100',
                                                    PIPELINE_BAR_CLASSES[
                                                        stage.status
                                                    ] ?? 'bg-primary/70',
                                                )}
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
                                                    className="block py-3 first:pt-0 last:pb-0"
                                                >
                                                    <TwoLineCell
                                                        avatar={
                                                            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                                                                <Icon className="size-4" />
                                                            </div>
                                                        }
                                                        primary={item.title}
                                                        secondary={
                                                            item.subtitle
                                                        }
                                                    />
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
                                                <TwoLineCell
                                                    avatar={
                                                        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300">
                                                            <CalendarClock className="size-4" />
                                                        </div>
                                                    }
                                                    primary={
                                                        interview.candidateName
                                                    }
                                                    secondary={
                                                        interview.jobTitle ??
                                                        'General application'
                                                    }
                                                />
                                                <p className="mt-1 pl-12 text-xs font-medium text-primary">
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
