import { Head, Link } from '@inertiajs/react';
import { FileText, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { ConfirmDeleteDialog } from '@/components/admin/confirm-delete-dialog';
import { EmptyState } from '@/components/admin/empty-state';
import { RowActionsMenu } from '@/components/admin/row-actions-menu';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
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
import type { Paginated, PolicyDocument } from '@/types';
import { PaginationLinks } from '@/components/pagination-links';

export default function PolicyDocumentsIndex({
    documents,
    filters,
}: {
    documents: Paginated<PolicyDocument>;
    filters: { search: string | null };
}) {
    const { search, setSearch } = useDebouncedSearch(
        admin.policyDocuments.index().url,
        filters,
    );

    return (
        <>
            <Head title="Policy Documents" />
            <div className="p-4 sm:p-6">
                <AdminPageHeader
                    title="Policy Documents"
                    description="Internal policies the AI copilot can search and cite when answering staff questions."
                    icon={FileText}
                    stats={[{ label: 'total', value: documents.total }]}
                    action={
                        <Button asChild>
                            <Link href={admin.policyDocuments.create()}>
                                <Plus className="size-4" />
                                New Document
                            </Link>
                        </Button>
                    }
                />

                <div className="mb-4">
                    <div className="relative max-w-xs">
                        <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search documents..."
                            className="pl-8"
                        />
                    </div>
                </div>

                {documents.data.length === 0 ? (
                    <EmptyState
                        icon={FileText}
                        title={
                            filters.search
                                ? 'No documents match your search'
                                : 'No policy documents yet'
                        }
                        description={
                            filters.search
                                ? 'Try a different search term.'
                                : 'Add a document for the AI copilot to search and cite.'
                        }
                        action={
                            !filters.search && (
                                <Button asChild>
                                    <Link href={admin.policyDocuments.create()}>
                                        <Plus className="size-4" />
                                        New Document
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
                                    <TableHead>Title</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="w-0" />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {documents.data.map((document) => (
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
                                            <RowActionsMenu>
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        href={admin.policyDocuments.edit(
                                                            document.id,
                                                        )}
                                                    >
                                                        <Pencil className="size-4" />
                                                        Edit
                                                    </Link>
                                                </DropdownMenuItem>
                                                <ConfirmDeleteDialog
                                                    url={toUrl(
                                                        admin.policyDocuments.destroy(
                                                            document.id,
                                                        ),
                                                    )}
                                                    title="Delete policy document"
                                                    description={`Are you sure you want to delete "${document.title}"? This cannot be undone.`}
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

                        <div className="mt-6">
                            <PaginationLinks links={documents.links} />
                        </div>
                    </>
                )}
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
