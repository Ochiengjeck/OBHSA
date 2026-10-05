import { Head, Link } from '@inertiajs/react';
import { Mail, Pencil, Plus, Trash2 } from 'lucide-react';
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
import type { CommunicationTemplate, Paginated } from '@/types';
import { PaginationLinks } from '@/components/pagination-links';

export default function CommunicationTemplatesIndex({
    templates,
    filters,
}: {
    templates: Paginated<CommunicationTemplate>;
    filters: { search: string | null };
}) {
    const { search, setSearch } = useDebouncedSearch(
        admin.communicationTemplates.index().url,
        filters,
    );

    return (
        <>
            <Head title="Message Templates" />
            <div className="p-4 sm:p-6">
                <AdminPageHeader
                    title="Message Templates"
                    description="Reusable email templates recruiters can send to candidates from the candidate dossier."
                    icon={Mail}
                    stats={[{ label: 'total', value: templates.total }]}
                    action={
                        <Button asChild>
                            <Link href={admin.communicationTemplates.create()}>
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
                        icon={Mail}
                        title={
                            filters.search
                                ? 'No templates match your search'
                                : 'No message templates yet'
                        }
                        description={
                            filters.search
                                ? 'Try a different search term.'
                                : 'Create a template recruiters can reuse when messaging candidates.'
                        }
                        action={
                            !filters.search && (
                                <Button asChild>
                                    <Link
                                        href={admin.communicationTemplates.create()}
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
                                    <TableHead>Subject</TableHead>
                                    <TableHead className="w-0" />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {templates.data.map((template) => (
                                    <ClickableTableRow
                                        key={template.id}
                                        href={toUrl(
                                            admin.communicationTemplates.edit(
                                                template.id,
                                            ),
                                        )}
                                    >
                                        <TableCell className="font-medium">
                                            {template.name}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {template.subject}
                                        </TableCell>
                                        <TableCell>
                                            <RowActionsMenu>
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        href={admin.communicationTemplates.edit(
                                                            template.id,
                                                        )}
                                                    >
                                                        <Pencil className="size-4" />
                                                        Edit
                                                    </Link>
                                                </DropdownMenuItem>
                                                <ConfirmDeleteDialog
                                                    url={toUrl(
                                                        admin.communicationTemplates.destroy(
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

CommunicationTemplatesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        {
            title: 'Message Templates',
            href: admin.communicationTemplates.index(),
        },
    ],
};
