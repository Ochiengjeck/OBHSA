import { Head, Link } from '@inertiajs/react';
import { ListTodo, Pencil, Plus, Trash2 } from 'lucide-react';
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
import type { OnboardingChecklistTemplate, Paginated } from '@/types';
import { PaginationLinks } from '@/components/pagination-links';

export default function OnboardingChecklistTemplatesIndex({
    templates,
    filters,
}: {
    templates: Paginated<OnboardingChecklistTemplate>;
    filters: { search: string | null };
}) {
    const { search, setSearch } = useDebouncedSearch(
        admin.onboardingChecklistTemplates.index().url,
        filters,
    );

    return (
        <>
            <Head title="Onboarding Checklist Templates" />
            <div className="p-4 sm:p-6">
                <AdminPageHeader
                    title="Onboarding Checklist Templates"
                    description="Checklists instantiated against an application's requirements the moment it enters onboarding."
                    icon={ListTodo}
                    stats={[{ label: 'total', value: templates.total }]}
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
                        placeholder="Search templates..."
                    />
                </AdminFilterToolbar>

                {templates.data.length === 0 ? (
                    <EmptyState
                        icon={ListTodo}
                        title={
                            filters.search
                                ? 'No templates match your search'
                                : 'No checklist templates yet'
                        }
                        description={
                            filters.search
                                ? 'Try a different search term.'
                                : 'Create a checklist template for new hires entering onboarding.'
                        }
                        action={
                            !filters.search && (
                                <Button asChild>
                                    <Link
                                        href={admin.onboardingChecklistTemplates.create()}
                                    >
                                        <Plus className="size-4" />
                                        New Template
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
                                    <TableHead>Items</TableHead>
                                    <TableHead>Default</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="w-0" />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {templates.data.map((template) => (
                                    <ClickableTableRow
                                        key={template.id}
                                        href={toUrl(
                                            admin.onboardingChecklistTemplates.edit(
                                                template.id,
                                            ),
                                        )}
                                    >
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
                                                {template.items_count ?? 0}{' '}
                                                items
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
                                            <RowActionsMenu>
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        href={admin.onboardingChecklistTemplates.edit(
                                                            template.id,
                                                        )}
                                                    >
                                                        <Pencil className="size-4" />
                                                        Edit
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        href={admin.onboardingChecklistTemplates.items.index(
                                                            template.id,
                                                        )}
                                                    >
                                                        <ListTodo className="size-4" />
                                                        Manage items
                                                    </Link>
                                                </DropdownMenuItem>
                                                <ConfirmDeleteDialog
                                                    url={toUrl(
                                                        admin.onboardingChecklistTemplates.destroy(
                                                            template.id,
                                                        ),
                                                    )}
                                                    title="Delete template"
                                                    description={`Are you sure you want to delete "${template.name}"? This cannot be undone.`}
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
                            <PaginationLinks links={templates.links} />
                        </div>
                    </>
                )}
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
