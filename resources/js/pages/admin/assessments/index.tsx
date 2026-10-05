import { Head, Link } from '@inertiajs/react';
import { ClipboardCheck, Pencil, Plus, Trash2 } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { ClickableTableRow } from '@/components/admin/clickable-table-row';
import { ConfirmDeleteDialog } from '@/components/admin/confirm-delete-dialog';
import { EmptyState } from '@/components/admin/empty-state';
import {
    AdminFilterToolbar,
    ClearFiltersButton,
    ToolbarSearchInput,
} from '@/components/admin/filter-toolbar';
import { RowActionsMenu } from '@/components/admin/row-actions-menu';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useDebouncedSearch } from '@/hooks/use-debounced-search';
import { toUrl } from '@/lib/utils';
import admin from '@/routes/admin';
import type { Assessment, Paginated } from '@/types';
import { PaginationLinks } from '@/components/pagination-links';

export default function AssessmentsIndex({
    assessments,
    filters,
}: {
    assessments: Paginated<Assessment>;
    filters: { search: string | null };
}) {
    const { search, setSearch } = useDebouncedSearch(
        admin.assessments.index().url,
        filters,
    );

    return (
        <>
            <Head title="Assessments" />
            <div className="p-4 sm:p-6">
                <AdminPageHeader
                    title="Assessments"
                    description="Competency assessments assignable from a candidate's dossier."
                    icon={ClipboardCheck}
                    stats={[{ label: 'total', value: assessments.total }]}
                    action={
                        <Button asChild>
                            <Link href={admin.assessments.create()}>
                                <Plus className="size-4" />
                                New Assessment
                            </Link>
                        </Button>
                    }
                />

                <AdminFilterToolbar
                    trailing={
                        search && (
                            <ClearFiltersButton onClick={() => setSearch('')} />
                        )
                    }
                >
                    <ToolbarSearchInput
                        value={search}
                        onChange={setSearch}
                        placeholder="Search assessments..."
                    />
                </AdminFilterToolbar>

                {assessments.data.length === 0 ? (
                    <EmptyState
                        icon={ClipboardCheck}
                        title={
                            filters.search
                                ? 'No assessments match your search'
                                : 'No assessments yet'
                        }
                        description={
                            filters.search
                                ? 'Try a different search term.'
                                : 'Create a competency assessment to assign to candidates.'
                        }
                        action={
                            !filters.search && (
                                <Button asChild>
                                    <Link href={admin.assessments.create()}>
                                        <Plus className="size-4" />
                                        New Assessment
                                    </Link>
                                </Button>
                            )
                        }
                    />
                ) : (
                    <>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Delivery</TableHead>
                                    <TableHead>Pass / Attempts</TableHead>
                                    <TableHead>Questions</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="w-0" />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {assessments.data.map((assessment) => (
                                    <ClickableTableRow
                                        key={assessment.id}
                                        href={toUrl(
                                            admin.assessments.edit(
                                                assessment.id,
                                            ),
                                        )}
                                    >
                                        <TableCell className="font-medium">
                                            {assessment.name}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground capitalize">
                                            {assessment.delivery_mode.replaceAll(
                                                '_',
                                                ' ',
                                            )}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {assessment.passing_score}% /{' '}
                                            {assessment.max_attempts}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            <Link
                                                href={admin.assessments.questions.index(
                                                    assessment.id,
                                                )}
                                                className="font-medium text-primary hover:underline"
                                            >
                                                {assessment.questions_count ??
                                                    0}{' '}
                                                questions
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    assessment.is_active
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                            >
                                                {assessment.is_active
                                                    ? 'Active'
                                                    : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <RowActionsMenu>
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        href={admin.assessments.edit(
                                                            assessment.id,
                                                        )}
                                                    >
                                                        <Pencil className="size-4" />
                                                        Edit
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        href={admin.assessments.questions.index(
                                                            assessment.id,
                                                        )}
                                                    >
                                                        <ClipboardCheck className="size-4" />
                                                        Manage questions
                                                    </Link>
                                                </DropdownMenuItem>
                                                <ConfirmDeleteDialog
                                                    url={toUrl(
                                                        admin.assessments.destroy(
                                                            assessment.id,
                                                        ),
                                                    )}
                                                    title="Delete assessment"
                                                    description={`Are you sure you want to delete "${assessment.name}"? This cannot be undone.`}
                                                    trigger={
                                                        <DropdownMenuItem
                                                            variant="destructive"
                                                            onSelect={(e) =>
                                                                e.preventDefault()
                                                            }
                                                        >
                                                            <Trash2 className="size-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    }
                                                />
                                            </RowActionsMenu>
                                        </TableCell>
                                    </ClickableTableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <div className="mt-6">
                            <PaginationLinks links={assessments.links} />
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

AssessmentsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Assessments', href: admin.assessments.index() },
    ],
};
