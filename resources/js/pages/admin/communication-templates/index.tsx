import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { ConfirmDeleteDialog } from '@/components/admin/confirm-delete-dialog';
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
import type { CommunicationTemplate } from '@/types';

export default function CommunicationTemplatesIndex({
    templates,
}: {
    templates: CommunicationTemplate[];
}) {
    return (
        <>
            <Head title="Message Templates" />
            <div className="p-4 sm:p-6">
                <AdminPageHeader
                    title="Message Templates"
                    description="Reusable email templates recruiters can send to candidates from the candidate dossier."
                    action={
                        <Button asChild>
                            <Link href={admin.communicationTemplates.create()}>
                                <Plus className="size-4" />
                                New Template
                            </Link>
                        </Button>
                    }
                />

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead className="w-0" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {templates.map((template) => (
                            <TableRow key={template.id}>
                                <TableCell className="font-medium">
                                    {template.name}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {template.subject}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center justify-end gap-3">
                                        <Link
                                            href={admin.communicationTemplates.edit(
                                                template.id,
                                            )}
                                            className="text-sm font-medium text-primary hover:underline"
                                        >
                                            Edit
                                        </Link>
                                        <ConfirmDeleteDialog
                                            url={toUrl(
                                                admin.communicationTemplates.destroy(
                                                    template.id,
                                                ),
                                            )}
                                            title="Delete template"
                                            description={`Are you sure you want to delete "${template.name}"? This cannot be undone.`}
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

CommunicationTemplatesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        {
            title: 'Message Templates',
            href: admin.communicationTemplates.index(),
        },
    ],
};
