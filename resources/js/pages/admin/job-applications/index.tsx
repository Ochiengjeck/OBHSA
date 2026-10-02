import { Head, Link, router } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { StatusBadge } from '@/components/admin/status-badge';
import { PaginationLinks } from '@/components/pagination-links';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import admin from '@/routes/admin';
import type { Paginated } from '@/types';

type JobApplicationRow = {
    id: number;
    candidate_id: number;
    status: string;
    created_at: string;
    days_in_stage: number | null;
    candidate: { id: number; full_name: string; email: string };
    job_listing: { id: number; title: string } | null;
    recruiter: { id: number; name: string } | null;
};

type StatusOption = { value: string; label: string };

const QUICK_FILTER_STAGES = [
    'submitted',
    'eligibility_review',
    'recruiter_review',
    'screening',
    'credentialing',
    'interview',
    'assessment',
    'final_review',
    'on_hold',
];

export default function JobApplicationsIndex({
    applications,
    filters,
    statusOptions,
    statusCounts,
}: {
    applications: Paginated<JobApplicationRow>;
    filters: { status: string | null };
    statusOptions: StatusOption[];
    statusCounts: Record<string, number>;
}) {
    function updateStatusFilter(value: string | null) {
        router.get(
            admin.jobApplications.index().url,
            { status: value ?? undefined },
            { preserveState: true, replace: true },
        );
    }

    const quickFilters = statusOptions.filter((option) =>
        QUICK_FILTER_STAGES.includes(option.value),
    );

    return (
        <>
            <Head title="Job Applications" />
            <div className="p-4 sm:p-6">
                <AdminPageHeader
                    title="Job Applications"
                    description="Review and triage applications submitted by caregivers."
                />

                <div className="mb-4 flex flex-wrap items-center gap-2">
                    <Button
                        size="sm"
                        variant={filters.status ? 'outline' : 'default'}
                        onClick={() => updateStatusFilter(null)}
                    >
                        All
                    </Button>
                    {quickFilters.map((option) => (
                        <Button
                            key={option.value}
                            size="sm"
                            variant={
                                filters.status === option.value
                                    ? 'default'
                                    : 'outline'
                            }
                            onClick={() => updateStatusFilter(option.value)}
                        >
                            {option.label} ({statusCounts[option.value] ?? 0})
                        </Button>
                    ))}

                    <Select
                        value={filters.status ?? 'all'}
                        onValueChange={(value) =>
                            updateStatusFilter(value === 'all' ? null : value)
                        }
                    >
                        <SelectTrigger className="ml-auto w-56">
                            <SelectValue placeholder="All statuses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            {statusOptions.map((option) => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Applicant</TableHead>
                            <TableHead>Position</TableHead>
                            <TableHead>Submitted</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Days in Stage</TableHead>
                            <TableHead>Recruiter</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {applications.data.map((application) => (
                            <TableRow key={application.id}>
                                <TableCell>
                                    <Link
                                        href={admin.candidates.show(
                                            application.candidate_id,
                                        )}
                                        className="font-medium text-primary hover:underline"
                                    >
                                        {application.candidate.full_name}
                                    </Link>
                                    <p className="text-xs text-muted-foreground">
                                        {application.candidate.email}
                                    </p>
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {application.job_listing?.title ??
                                        'General Application'}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {new Date(
                                        application.created_at,
                                    ).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    <StatusBadge status={application.status} />
                                </TableCell>
                                <TableCell
                                    className={cn(
                                        'text-muted-foreground',
                                        (application.days_in_stage ?? 0) >= 7 &&
                                            'font-medium text-amber-600',
                                    )}
                                >
                                    {application.days_in_stage ?? '—'}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {application.recruiter?.name ??
                                        'Unassigned'}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <div className="mt-6">
                    <PaginationLinks links={applications.links} />
                </div>
            </div>
        </>
    );
}

JobApplicationsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Applications', href: admin.jobApplications.index() },
    ],
};
