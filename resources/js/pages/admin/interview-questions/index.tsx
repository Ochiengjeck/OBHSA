import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { ConfirmDeleteDialog } from '@/components/admin/confirm-delete-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { CAREGIVER_SPECIALTIES } from '@/lib/caregiver-specialties';
import { toUrl } from '@/lib/utils';
import admin from '@/routes/admin';
import type { InterviewQuestion } from '@/types';

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
}: {
    questions: InterviewQuestion[];
}) {
    return (
        <>
            <Head title="Interview Questions" />
            <div className="p-4 sm:p-6">
                <AdminPageHeader
                    title="Interview Questions"
                    description="The question bank interviewers score candidates against. General questions apply to every specialty."
                    action={
                        <Button asChild>
                            <Link href={admin.interviewQuestions.create()}>
                                <Plus className="size-4" />
                                New Question
                            </Link>
                        </Button>
                    }
                />

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
                        {questions.map((question) => (
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
                                    <div className="flex items-center justify-end gap-3">
                                        <Link
                                            href={admin.interviewQuestions.edit(
                                                question.id,
                                            )}
                                            className="text-sm font-medium text-primary hover:underline"
                                        >
                                            Edit
                                        </Link>
                                        <ConfirmDeleteDialog
                                            url={toUrl(
                                                admin.interviewQuestions.destroy(
                                                    question.id,
                                                ),
                                            )}
                                            title="Delete question"
                                            description="Are you sure you want to delete this question? This cannot be undone."
                                            trigger={
                                                <button className="text-sm font-medium text-destructive hover:underline">
                                                    Delete
                                                </button>
                                            }
                                        />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
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
