import { Head, Link, router } from '@inertiajs/react';
import { CalendarClock } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { ClickableTableRow } from '@/components/admin/clickable-table-row';
import { EmptyState } from '@/components/admin/empty-state';
import {
    AdminFilterToolbar,
    ClearFiltersButton,
} from '@/components/admin/filter-toolbar';
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
import { toUrl } from '@/lib/utils';
import admin from '@/routes/admin';
import type { InterviewListRow, Paginated, RecruiterOption } from '@/types';

const STATUS_FILTERS = [
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'no_show', label: 'No Show' },
];

export default function InterviewsIndex({
    interviews,
    filters,
    interviewers,
}: {
    interviews: Paginated<InterviewListRow>;
    filters: { interviewer_id: number | null; status: string | null };
    interviewers: RecruiterOption[];
}) {
    function updateFilters(next: Partial<typeof filters>) {
        router.get(
            admin.interviews.index().url,
            { ...filters, ...next },
            { preserveState: true, replace: true },
        );
    }

    return (
        <>
            <Head title="Interviews" />
            <div className="p-4 sm:p-6">
                <AdminPageHeader
                    title="Interviews"
                    description="Every interview scheduled across candidates, past and upcoming."
                    icon={CalendarClock}
                    stats={[{ label: 'total', value: interviews.total }]}
                />

                <AdminFilterToolbar
                    trailing={
                        (filters.status || filters.interviewer_id) && (
                            <ClearFiltersButton
                                onClick={() =>
                                    updateFilters({
                                        status: null,
                                        interviewer_id: null,
                                    })
                                }
                            />
                        )
                    }
                >
                    <Button
                        size="sm"
                        variant={filters.status ? 'outline' : 'default'}
                        onClick={() => updateFilters({ status: null })}
                    >
                        All
                    </Button>
                    {STATUS_FILTERS.map((option) => (
                        <Button
                            key={option.value}
                            size="sm"
                            variant={
                                filters.status === option.value
                                    ? 'default'
                                    : 'outline'
                            }
                            onClick={() =>
                                updateFilters({ status: option.value })
                            }
                        >
                            {option.label}
                        </Button>
                    ))}

                    <Select
                        value={
                            filters.interviewer_id
                                ? String(filters.interviewer_id)
                                : 'all'
                        }
                        onValueChange={(value) =>
                            updateFilters({
                                interviewer_id:
                                    value === 'all' ? null : Number(value),
                            })
                        }
                    >
                        <SelectTrigger className="w-56">
                            <SelectValue placeholder="All interviewers" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">
                                All Interviewers
                            </SelectItem>
                            {interviewers.map((interviewer) => (
                                <SelectItem
                                    key={interviewer.id}
                                    value={String(interviewer.id)}
                                >
                                    {interviewer.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </AdminFilterToolbar>

                {interviews.data.length === 0 ? (
                    <EmptyState
                        icon={CalendarClock}
                        title="No interviews match these filters"
                        description="Interviews scheduled for candidates will show up here."
                    />
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Candidate</TableHead>
                                <TableHead>Interviewer</TableHead>
                                <TableHead>Format</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Recommendation</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {interviews.data.map((interview) => (
                                <ClickableTableRow
                                    key={interview.id}
                                    href={toUrl(
                                        admin.interviews.show(interview.id),
                                    )}
                                >
                                    <TableCell className="text-muted-foreground">
                                        <Link
                                            href={admin.interviews.show(
                                                interview.id,
                                            )}
                                            className="font-medium text-primary hover:underline"
                                        >
                                            {new Date(
                                                interview.scheduled_at,
                                            ).toLocaleString()}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {
                                            interview.application.candidate
                                                .full_name
                                        }
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {interview.interviewer?.name ??
                                            'Unassigned'}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground capitalize">
                                        {interview.format.replaceAll('_', ' ')}
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge
                                            status={interview.status}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {interview.recommendation && (
                                            <StatusBadge
                                                status={
                                                    interview.recommendation
                                                }
                                            />
                                        )}
                                    </TableCell>
                                </ClickableTableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}

                {interviews.data.length > 0 && (
                    <div className="mt-6">
                        <PaginationLinks links={interviews.links} />
                    </div>
                )}
            </div>
        </>
    );
}

InterviewsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Interviews', href: admin.interviews.index() },
    ],
};
