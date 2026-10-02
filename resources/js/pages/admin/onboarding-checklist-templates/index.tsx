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
import type { OnboardingChecklistTemplate } from '@/types';

export default function OnboardingChecklistTemplatesIndex({
    templates,
}: {
    templates: OnboardingChecklistTemplate[];
}) {
    return (
        <>
            <Head title="Onboarding Checklist Templates" />
            <div className="p-4 sm:p-6">
                <AdminPageHeader
                    title="Onboarding Checklist Templates"
                    description="Checklists instantiated against an application's requirements the moment it enters onboarding."
                    action={
                        <Button asChild>
                            <Link
                                href={admin.onboardingChecklistTemplates.create()}
                            >
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
                            <TableHead>Items</TableHead>
                            <TableHead>Default</TableHead>
                            <TableHead>Status</TableHead>
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
                                    <Link
                                        href={admin.onboardingChecklistTemplates.items.index(
                                            template.id,
                                        )}
                                        className="font-medium text-primary hover:underline"
                                    >
                                        {template.items_count ?? 0} items
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    {template.is_default && (
                                        <Badge>Default</Badge>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            template.is_active
                                                ? 'default'
                                                : 'secondary'
                                        }
                                    >
                                        {template.is_active
                                            ? 'Active'
                                            : 'Inactive'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center justify-end gap-3">
                                        <Link
                                            href={admin.onboardingChecklistTemplates.edit(
                                                template.id,
                                            )}
                                            className="text-sm font-medium text-primary hover:underline"
                                        >
                                            Edit
                                        </Link>
                                        <ConfirmDeleteDialog
                                            url={toUrl(
                                                admin.onboardingChecklistTemplates.destroy(
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

OnboardingChecklistTemplatesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        {
            title: 'Onboarding Checklists',
            href: admin.onboardingChecklistTemplates.index(),
        },
    ],
};
