import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, ListTodo, Pencil, Plus, Trash2 } from 'lucide-react';
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
                    icon={ListTodo}
                    stats={[{ label: 'total', value: items.length }]}
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

                {items.length === 0 ? (
                    <EmptyState
                        icon={ListTodo}
                        title="No checklist items yet"
                        description="Add items new hires will complete during onboarding."
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
                ) : (
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
                                        <RowActionsMenu>
                                            <DropdownMenuItem asChild>
                                                <Link
                                                    href={admin.items.edit(
                                                        item.id,
                                                    )}
                                                >
                                                    <Pencil className="size-4" />
                                                    Edit
                                                </Link>
                                            </DropdownMenuItem>
                                            <ConfirmDeleteDialog
                                                url={toUrl(
                                                    admin.items.destroy(
                                                        item.id,
                                                    ),
                                                )}
                                                title="Delete checklist item"
                                                description={`Are you sure you want to delete "${item.label}"? This cannot be undone.`}
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

OnboardingChecklistTemplateItemsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        {
            title: 'Onboarding Checklists',
            href: admin.onboardingChecklistTemplates.index(),
        },
    ],
};
