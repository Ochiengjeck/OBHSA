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
import { toUrl } from '@/lib/utils';
import admin from '@/routes/admin';
import type { Assessment } from '@/types';

export default function AssessmentsIndex({
    assessments,
}: {
    assessments: Assessment[];
}) {
    return (
        <>
            <Head title="Assessments" />
            <div className="p-4 sm:p-6">
                <AdminPageHeader
                    title="Assessments"
                    description="Competency assessments assignable from a candidate's dossier."
                    action={
                        <Button asChild>
                            <Link href={admin.assessments.create()}>
                                <Plus className="size-4" />
                                New Assessment
                            </Link>
                        </Button>
                    }
                />

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
                        {assessments.map((assessment) => (
                            <TableRow key={assessment.id}>
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
                                        {assessment.questions_count ?? 0}{' '}
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
                                    <div className="flex items-center justify-end gap-3">
                                        <Link
                                            href={admin.assessments.edit(
                                                assessment.id,
                                            )}
                                            className="text-sm font-medium text-primary hover:underline"
                                        >
                                            Edit
                                        </Link>
                                        <ConfirmDeleteDialog
                                            url={toUrl(
                                                admin.assessments.destroy(
                                                    assessment.id,
                                                ),
                                            )}
                                            title="Delete assessment"
                                            description={`Are you sure you want to delete "${assessment.name}"? This cannot be undone.`}
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

AssessmentsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Assessments', href: admin.assessments.index() },
    ],
};
