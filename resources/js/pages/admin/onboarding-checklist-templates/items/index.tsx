import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Plus } from 'lucide-react';
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
import type {
    OnboardingChecklistTemplate,
    OnboardingChecklistTemplateItem,
} from '@/types';

export default function OnboardingChecklistTemplateItemsIndex({
    template,
    items,
}: {
    template: OnboardingChecklistTemplate;
    items: OnboardingChecklistTemplateItem[];
}) {
    return (
        <>
            <Head title={`Checklist Items — ${template.name}`} />
            <div className="p-4 sm:p-6">
                <Button variant="ghost" size="sm" asChild className="-ml-3">
                    <Link href={admin.onboardingChecklistTemplates.index()}>
                        <ArrowLeft className="size-4" />
                        All Templates
                    </Link>
                </Button>

                <AdminPageHeader
                    title={template.name}
                    description="Checklist items for this onboarding template."
                    action={
                        <Button asChild>
                            <Link
                                href={admin.onboardingChecklistTemplates.items.create(
                                    template.id,
                                )}
                            >
                                <Plus className="size-4" />
                                Add Item
                            </Link>
                        </Button>
                    }
                />

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Label</TableHead>
                            <TableHead>Task Key</TableHead>
                            <TableHead>Position</TableHead>
                            <TableHead>Blocking</TableHead>
                            <TableHead className="w-0" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">
                                    {item.label}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {item.task_key}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {item.position}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            item.is_blocking
                                                ? 'default'
                                                : 'secondary'
                                        }
                                    >
                                        {item.is_blocking
                                            ? 'Blocking'
                                            : 'Optional'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center justify-end gap-3">
                                        <Link
                                            href={admin.items.edit(item.id)}
                                            className="text-sm font-medium text-primary hover:underline"
                                        >
                                            Edit
                                        </Link>
                                        <ConfirmDeleteDialog
                                            url={toUrl(
                                                admin.items.destroy(item.id),
                                            )}
                                            title="Delete checklist item"
                                            description={`Are you sure you want to delete "${item.label}"? This cannot be undone.`}
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

OnboardingChecklistTemplateItemsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        {
            title: 'Onboarding Checklists',
            href: admin.onboardingChecklistTemplates.index(),
        },
    ],
};
