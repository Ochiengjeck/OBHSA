import { Head, Link } from '@inertiajs/react';
import { ClipboardList, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { ConfirmDeleteDialog } from '@/components/admin/confirm-delete-dialog';
import { EmptyState } from '@/components/admin/empty-state';
import { RowActionsMenu } from '@/components/admin/row-actions-menu';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useDebouncedSearch } from '@/hooks/use-debounced-search';
import { CAREGIVER_SPECIALTIES } from '@/lib/caregiver-specialties';
import { toUrl } from '@/lib/utils';
import admin from '@/routes/admin';
import type { InterviewQuestion, Paginated } from '@/types';
import { PaginationLinks } from '@/components/pagination-links';

function specialtyLabel(specialty: string | null) {
    if (!specialty) {
        return 'General';
    }

    return (
        CAREGIVER_SPECIALTIES.find((option) => option.value === specialty)
            ?.label ?? specialty
    );
}

export default function InterviewQuestionsIndex({
    questions,
    filters,
}: {
    questions: Paginated<InterviewQuestion>;
    filters: { search: string | null };
}) {
    const { search, setSearch } = useDebouncedSearch(
        admin.interviewQuestions.index().url,
        filters,
    );

    return (
        <>
            <Head title="Interview Questions" />
            <div className="p-4 sm:p-6">
                <AdminPageHeader
                    title="Interview Questions"
                    description="The question bank interviewers score candidates against. General questions apply to every specialty."
                    icon={ClipboardList}
                    stats={[{ label: 'total', value: questions.total }]}
                    action={
                        <Button asChild>
                            <Link href={admin.interviewQuestions.create()}>
                                <Plus className="size-4" />
                                New Question
                            </Link>
                        </Button>
                    }
                />

                <div className="mb-4">
                    <div className="relative max-w-xs">
                        <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search questions..."
                            className="pl-8"
                        />
                    </div>
                </div>

                {questions.data.length === 0 ? (
                    <EmptyState
                        icon={ClipboardList}
                        title={
                            filters.search
                                ? 'No questions match your search'
                                : 'No interview questions yet'
                        }
                        description={
                            filters.search
                                ? 'Try a different search term.'
                                : 'Add questions for interviewers to score candidates against.'
                        }
                        action={
                            !filters.search && (
                                <Button asChild>
                                    <Link
                                        href={admin.interviewQuestions.create()}
                                    >
                                        <Plus className="size-4" />
                                        New Question
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
                                    <TableHead>Question</TableHead>
                                    <TableHead>Specialty</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="w-0" />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {questions.data.map((question) => (
                                    <TableRow key={question.id}>
                                        <TableCell className="max-w-md font-medium">
                                            {question.question}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {specialtyLabel(question.specialty)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    question.is_active
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                            >
                                                {question.is_active
                                                    ? 'Active'
                                                    : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <RowActionsMenu>
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        href={admin.interviewQuestions.edit(
                                                            question.id,
                                                        )}
                                                    >
                                                        <Pencil className="size-4" />
                                                        Edit
                                                    </Link>
                                                </DropdownMenuItem>
                                                <ConfirmDeleteDialog
                                                    url={toUrl(
                                                        admin.interviewQuestions.destroy(
                                                            question.id,
                                                        ),
                                                    )}
                                                    title="Delete question"
                                                    description="Are you sure you want to delete this question? This cannot be undone."
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
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <div className="mt-6">
                            <PaginationLinks links={questions.links} />
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

InterviewQuestionsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        {
            title: 'Interview Questions',
            href: admin.interviewQuestions.index(),
        },
    ],
};
