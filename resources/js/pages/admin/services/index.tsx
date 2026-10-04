import { Head, Link } from '@inertiajs/react';
import {
    Briefcase,
    ExternalLink,
    Pencil,
    Plus,
    Search,
    Trash2,
} from 'lucide-react';
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
import admin from '@/routes/admin';
import { show as showOnSite } from '@/routes/services';
import { toUrl } from '@/lib/utils';
import type { Paginated, Service } from '@/types';
import { PaginationLinks } from '@/components/pagination-links';

export default function ServicesIndex({
    services,
    filters,
}: {
    services: Paginated<Service>;
    filters: { search: string | null };
}) {
    const { search, setSearch } = useDebouncedSearch(
        admin.services.index().url,
        filters,
    );

    return (
        <>
            <Head title="Services" />
            <div className="p-4 sm:p-6">
                <AdminPageHeader
                    title="Services"
                    description="Manage the staffing services shown on the public site."
                    icon={Briefcase}
                    stats={[{ label: 'total', value: services.total }]}
                    action={
                        <Button asChild>
                            <Link href={admin.services.create()}>
                                <Plus className="size-4" />
                                New Service
                            </Link>
                        </Button>
                    }
                />

                <div className="mb-4 flex items-center gap-2">
                    <div className="relative max-w-xs flex-1">
                        <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search services..."
                            className="pl-8"
                        />
                    </div>
                </div>

                {services.data.length === 0 ? (
                    <EmptyState
                        icon={Briefcase}
                        title={
                            filters.search
                                ? 'No services match your search'
                                : 'No services yet'
                        }
                        description={
                            filters.search
                                ? 'Try a different search term.'
                                : 'Create your first service to show it on the public site.'
                        }
                        action={
                            !filters.search && (
                                <Button asChild>
                                    <Link href={admin.services.create()}>
                                        <Plus className="size-4" />
                                        New Service
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
                                    <TableHead>Summary</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="w-0" />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {services.data.map((service) => (
                                    <TableRow key={service.id}>
                                        <TableCell className="font-medium">
                                            {service.title}
                                        </TableCell>
                                        <TableCell className="max-w-sm truncate text-muted-foreground">
                                            {service.summary}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    service.is_active
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                            >
                                                {service.is_active
                                                    ? 'Active'
                                                    : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <RowActionsMenu>
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        href={admin.services.edit(
                                                            service.id,
                                                        )}
                                                    >
                                                        <Pencil className="size-4" />
                                                        Edit
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <a
                                                        href={toUrl(
                                                            showOnSite(
                                                                service.slug,
                                                            ),
                                                        )}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <ExternalLink className="size-4" />
                                                        View on site
                                                    </a>
                                                </DropdownMenuItem>
                                                <ConfirmDeleteDialog
                                                    url={toUrl(
                                                        admin.services.destroy(
                                                            service.id,
                                                        ),
                                                    )}
                                                    title="Delete service"
                                                    description={`Are you sure you want to delete "${service.title}"? This cannot be undone.`}
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
                            <PaginationLinks links={services.links} />
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

ServicesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Services', href: admin.services.index() },
    ],
};
