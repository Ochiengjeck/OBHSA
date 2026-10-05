import { Head, Link, router, usePage } from '@inertiajs/react';
import { Inbox, UserPlus } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { ClickableTableRow } from '@/components/admin/clickable-table-row';
import { EmptyState } from '@/components/admin/empty-state';
import {
    AdminFilterToolbar,
    ClearFiltersButton,
} from '@/components/admin/filter-toolbar';
import { RowActionsMenu } from '@/components/admin/row-actions-menu';
import { StatusBadge } from '@/components/admin/status-badge';
import { TwoLineCell } from '@/components/admin/two-line-cell';
import { PaginationLinks } from '@/components/pagination-links';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
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
import { rowAccentClass, toUrl } from '@/lib/utils';
import admin from '@/routes/admin';
import type { Auth, Paginated } from '@/types';

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
    const { auth } = usePage<{ auth: Auth }>().props;

    function updateStatusFilter(value: string | null) {
        router.get(
            admin.jobApplications.index().url,
            { status: value ?? undefined },
            { preserveState: true, replace: true },
        );
    }

    function assignToMe(applicationId: number) {
        router.put(
            toUrl(admin.jobApplications.recruiter(applicationId)),
            { assigned_recruiter_id: auth.user.id },
            { preserveScroll: true },
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
                    icon={Inbox}
                    stats={[{ label: 'total', value: applications.total }]}
                />

                <AdminFilterToolbar
                    trailing={
                        filters.status && (
                            <ClearFiltersButton
                                onClick={() => updateStatusFilter(null)}
                            />
                        )
                    }
                >
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
                        <SelectTrigger className="w-56">
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
                </AdminFilterToolbar>

                {applications.data.length === 0 ? (
                    <EmptyState
                        icon={Inbox}
                        title={
                            filters.status
                                ? 'No applications in this stage'
                                : 'No applications yet'
                        }
                        description={
                            filters.status
                                ? 'Try a different stage or clear the filter.'
                                : 'Applications submitted by caregivers will show up here.'
                        }
                    />
                ) : (
                    <>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Applicant</TableHead>
                                    <TableHead>Position</TableHead>
                                    <TableHead>Submitted</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Days in Stage</TableHead>
                                    <TableHead>Recruiter</TableHead>
                                    <TableHead className="w-0" />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {applications.data.map((application) => (
                                    <ClickableTableRow
                                        key={application.id}
                                        href={toUrl(
                                            admin.candidates.show(
                                                application.candidate_id,
                                            ),
                                        )}
                                        className={rowAccentClass(
                                            (application.days_in_stage ?? 0) >=
                                                7
                                                ? 'amber'
                                                : null,
                                        )}
                                    >
                                        <TableCell>
                                            <TwoLineCell
                                                avatar={
                                                    <Avatar className="size-8">
                                                        <AvatarFallback>
                                                            {application.candidate.full_name
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                }
                                                primary={
                                                    <Link
                                                        href={admin.candidates.show(
                                                            application.candidate_id,
                                                        )}
                                                        className="text-primary hover:underline"
                                                    >
                                                        {
                                                            application
                                                                .candidate
                                                                .full_name
                                                        }
                                                    </Link>
                                                }
                                                secondary={
                                                    application.candidate.email
                                                }
                                            />
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
                                            <StatusBadge
                                                status={application.status}
                                            />
                                        </TableCell>
                                        <TableCell
                                            className={
                                                (application.days_in_stage ??
                                                    0) >= 7
                                                    ? 'font-medium text-amber-600'
                                                    : 'text-muted-foreground'
                                            }
                                        >
                                            {application.days_in_stage ?? '—'}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {application.recruiter?.name ??
                                                'Unassigned'}
                                        </TableCell>
                                        <TableCell>
                                            <RowActionsMenu>
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        href={admin.candidates.show(
                                                            application.candidate_id,
                                                        )}
                                                    >
                                                        View Candidate
                                                    </Link>
                                                </DropdownMenuItem>
                                                {!application.recruiter && (
                                                    <DropdownMenuItem
                                                        onSelect={() =>
                                                            assignToMe(
                                                                application.id,
                                                            )
                                                        }
                                                    >
                                                        <UserPlus className="size-4" />
                                                        Assign to me
                                                    </DropdownMenuItem>
                                                )}
                                            </RowActionsMenu>
                                        </TableCell>
                                    </ClickableTableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <div className="mt-6">
                            <PaginationLinks links={applications.links} />
                        </div>
                    </>
                )}
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
