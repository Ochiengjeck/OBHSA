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
import type { PolicyDocument } from '@/types';

export default function PolicyDocumentsIndex({
    documents,
}: {
    documents: PolicyDocument[];
}) {
    return (
        <>
            <Head title="Policy Documents" />
            <div className="p-4 sm:p-6">
                <AdminPageHeader
                    title="Policy Documents"
                    description="Internal policies the AI copilot can search and cite when answering staff questions."
                    action={
                        <Button asChild>
                            <Link href={admin.policyDocuments.create()}>
                                <Plus className="size-4" />
                                New Document
                            </Link>
                        </Button>
                    }
                />

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-0" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {documents.map((document) => (
                            <TableRow key={document.id}>
                                <TableCell className="font-medium">
                                    {document.title}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            document.is_active
                                                ? 'default'
                                                : 'secondary'
                                        }
                                    >
                                        {document.is_active
                                            ? 'Active'
                                            : 'Inactive'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center justify-end gap-3">
                                        <Link
                                            href={admin.policyDocuments.edit(
                                                document.id,
                                            )}
                                            className="text-sm font-medium text-primary hover:underline"
                                        >
                                            Edit
                                        </Link>
                                        <ConfirmDeleteDialog
                                            url={toUrl(
                                                admin.policyDocuments.destroy(
                                                    document.id,
                                                ),
                                            )}
                                            title="Delete policy document"
                                            description={`Are you sure you want to delete "${document.title}"? This cannot be undone.`}
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

PolicyDocumentsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Policy Documents', href: admin.policyDocuments.index() },
    ],
};
