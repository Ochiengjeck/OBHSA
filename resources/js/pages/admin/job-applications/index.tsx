import { Head, Link, router } from '@inertiajs/react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { StatusBadge } from '@/components/admin/status-badge';
import { PaginationLinks } from '@/components/pagination-links';
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
    full_name: string;
    email: string;
    status: string;
    created_at: string;
    job_listing: { id: number; title: string } | null;
};

export default function JobApplicationsIndex({
    applications,
    filters,
}: {
    applications: Paginated<JobApplicationRow>;
    filters: { status: string | null };
}) {
    function updateStatusFilter(value: string) {
        router.get(
            admin.jobApplications.index().url,
            { status: value === 'all' ? undefined : value },
            { preserveState: true, replace: true },
        );
    }

    return (
        <>
            <Head title="Job Applications" />
            <div className="p-4 sm:p-6">
                <AdminPageHeader
                    title="Job Applications"
                    description="Review and triage applications submitted by caregivers."
                />

                <div className="mb-4">
                    <Select
                        value={filters.status ?? 'all'}
                        onValueChange={updateStatusFilter}
                    >
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="All statuses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="reviewing">Reviewing</SelectItem>
                            <SelectItem value="shortlisted">
                                Shortlisted
                            </SelectItem>
                            <SelectItem value="hired">Hired</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
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
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {applications.data.map((application) => (
                            <TableRow key={application.id}>
                                <TableCell>
                                    <Link
                                        href={admin.jobApplications.show(
                                            application.id,
                                        )}
                                        className="font-medium text-primary hover:underline"
                                    >
                                        {application.full_name}
                                    </Link>
                                    <p className="text-xs text-muted-foreground">
                                        {application.email}
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
