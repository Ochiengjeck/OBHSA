import { Head, Link, router } from '@inertiajs/react';
import { ClipboardList } from 'lucide-react';
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
import type { Assessment, AssessmentAttemptListRow, Paginated } from '@/types';

const STATUS_FILTERS = [
    { value: 'pending', label: 'Pending' },
    { value: 'submitted', label: 'Needs Grading' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
];

export default function AssessmentAttemptsIndex({
    attempts,
    filters,
    assessments,
}: {
    attempts: Paginated<AssessmentAttemptListRow>;
    filters: { assessment_id: number | null; status: string | null };
    assessments: Pick<Assessment, 'id' | 'name'>[];
}) {
    function updateFilters(next: Partial<typeof filters>) {
        router.get(
            admin.assessmentAttempts.index().url,
            { ...filters, ...next },
            { preserveState: true, replace: true },
        );
    }

    return (
        <>
            <Head title="Assessment Attempts" />
            <div className="p-4 sm:p-6">
                <AdminPageHeader
                    title="Assessment Attempts"
                    description="Every assessment attempt across candidates, past and upcoming."
                    icon={ClipboardList}
                    stats={[{ label: 'total', value: attempts.total }]}
                />

                <AdminFilterToolbar
                    trailing={
                        (filters.status || filters.assessment_id) && (
                            <ClearFiltersButton
                                onClick={() =>
                                    updateFilters({
                                        status: null,
                                        assessment_id: null,
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
                            filters.assessment_id
                                ? String(filters.assessment_id)
                                : 'all'
                        }
                        onValueChange={(value) =>
                            updateFilters({
                                assessment_id:
                                    value === 'all' ? null : Number(value),
                            })
                        }
                    >
                        <SelectTrigger className="w-56">
                            <SelectValue placeholder="All assessments" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Assessments</SelectItem>
                            {assessments.map((assessment) => (
                                <SelectItem
                                    key={assessment.id}
                                    value={String(assessment.id)}
                                >
                                    {assessment.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </AdminFilterToolbar>

                {attempts.data.length === 0 ? (
                    <EmptyState
                        icon={ClipboardList}
                        title="No attempts match these filters"
                        description="Assessment attempts by candidates will show up here."
                    />
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Candidate</TableHead>
                                <TableHead>Assessment</TableHead>
                                <TableHead>Attempt</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Score</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {attempts.data.map((attempt) => (
                                <ClickableTableRow
                                    key={attempt.id}
                                    href={toUrl(
                                        admin.assessmentAttempts.show(
                                            attempt.id,
                                        ),
                                    )}
                                >
                                    <TableCell>
                                        <Link
                                            href={admin.assessmentAttempts.show(
                                                attempt.id,
                                            )}
                                            className="font-medium text-primary hover:underline"
                                        >
                                            {
                                                attempt.application.candidate
                                                    .full_name
                                            }
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {attempt.assessment.name}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        #{attempt.attempt_number}
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge status={attempt.status} />
                                    </TableCell>
                                    <TableCell>
                                        {attempt.score !== null ? (
                                            <StatusBadge
                                                status={
                                                    attempt.passed
                                                        ? 'passed'
                                                        : 'failed'
                                                }
                                            />
                                        ) : (
                                            <span className="text-muted-foreground">
                                                —
                                            </span>
                                        )}
                                    </TableCell>
                                </ClickableTableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}

                {attempts.data.length > 0 && (
                    <div className="mt-6">
                        <PaginationLinks links={attempts.links} />
                    </div>
                )}
            </div>
        </>
    );
}

AssessmentAttemptsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        {
            title: 'Assessment Attempts',
            href: admin.assessmentAttempts.index(),
        },
    ],
};
