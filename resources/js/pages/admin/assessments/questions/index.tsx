import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, ClipboardList, Pencil, Plus, Trash2 } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { ConfirmDeleteDialog } from '@/components/admin/confirm-delete-dialog';
import { EmptyState } from '@/components/admin/empty-state';
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
import { toUrl } from '@/lib/utils';
import admin from '@/routes/admin';
import type { Assessment, AssessmentQuestion } from '@/types';

export default function AssessmentQuestionsIndex({
    assessment,
    questions,
}: {
    assessment: Assessment;
    questions: AssessmentQuestion[];
}) {
    return (
        <>
            <Head title={`Questions — ${assessment.name}`} />
            <div className="p-4 sm:p-6">
                <Button variant="ghost" size="sm" asChild className="-ml-3">
                    <Link href={admin.assessments.index()}>
                        <ArrowLeft className="size-4" />
                        All Assessments
                    </Link>
                </Button>

                <AdminPageHeader
                    title={assessment.name}
                    description="Question bank for this assessment."
                    icon={ClipboardList}
                    stats={[{ label: 'total', value: questions.length }]}
                    action={
                        <Button asChild>
                            <Link
                                href={admin.assessments.questions.create(
                                    assessment.id,
                                )}
                            >
                                <Plus className="size-4" />
                                Add Question
                            </Link>
                        </Button>
                    }
                />

                {questions.length === 0 ? (
                    <EmptyState
                        icon={ClipboardList}
                        title="No questions yet"
                        description="Add questions to build this assessment's question bank."
                        action={
                            <Button asChild>
                                <Link
                                    href={admin.assessments.questions.create(
                                        assessment.id,
                                    )}
                                >
                                    <Plus className="size-4" />
                                    Add Question
                                </Link>
                            </Button>
                        }
                    />
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Question</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Points</TableHead>
                                <TableHead className="w-0" />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {questions.map((question) => (
                                <TableRow key={question.id}>
                                    <TableCell className="max-w-md font-medium">
                                        {question.question}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">
                                            {question.question_type ===
                                            'multiple_choice'
                                                ? 'Multiple Choice'
                                                : 'Short Answer'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {question.points}
                                    </TableCell>
                                    <TableCell>
                                        <RowActionsMenu>
                                            <DropdownMenuItem asChild>
                                                <Link
                                                    href={admin.questions.edit(
                                                        question.id,
                                                    )}
                                                >
                                                    <Pencil className="size-4" />
                                                    Edit
                                                </Link>
                                            </DropdownMenuItem>
                                            <ConfirmDeleteDialog
                                                url={toUrl(
                                                    admin.questions.destroy(
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
                )}
            </div>
        </>
    );
}

AssessmentQuestionsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Assessments', href: admin.assessments.index() },
    ],
};
