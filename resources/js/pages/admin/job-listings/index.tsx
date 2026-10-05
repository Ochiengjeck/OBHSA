import { Head, Link } from '@inertiajs/react';
import { ListChecks, Pencil, Plus, Trash2 } from 'lucide-react';
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
import type { JobListing, Paginated } from '@/types';
import { PaginationLinks } from '@/components/pagination-links';

export default function JobListingsIndex({
    jobListings,
    filters,
}: {
    jobListings: Paginated<JobListing>;
    filters: { search: string | null };
}) {
    const { search, setSearch } = useDebouncedSearch(
        admin.jobListings.index().url,
        filters,
    );

    return (
        <>
            <Head title="Job Listings" />
            <div className="p-4 sm:p-6">
                <AdminPageHeader
                    title="Job Listings"
                    description="Manage open shifts and positions shown on the public jobs board."
                    icon={ListChecks}
                    stats={[{ label: 'total', value: jobListings.total }]}
                    action={
                        <Button asChild>
                            <Link href={admin.jobListings.create()}>
                                <Plus className="size-4" />
                                New Listing
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
                        placeholder="Search listings..."
                    />
                </AdminFilterToolbar>

                {jobListings.data.length === 0 ? (
                    <EmptyState
                        icon={ListChecks}
                        title={
                            filters.search
                                ? 'No listings match your search'
                                : 'No job listings yet'
                        }
                        description={
                            filters.search
                                ? 'Try a different search term.'
                                : 'Create your first listing to show it on the jobs board.'
                        }
                        action={
                            !filters.search && (
                                <Button asChild>
                                    <Link href={admin.jobListings.create()}>
                                        <Plus className="size-4" />
                                        New Listing
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
                                    <TableHead>Location</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="w-0" />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {jobListings.data.map((listing) => (
                                    <ClickableTableRow
                                        key={listing.id}
                                        href={toUrl(
                                            admin.jobListings.edit(listing.id),
                                        )}
                                    >
                                        <TableCell className="font-medium">
                                            {listing.title}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {listing.location_city},{' '}
                                            {listing.location_state}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {listing.employment_type}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    listing.is_active
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                            >
                                                {listing.is_active
                                                    ? 'Active'
                                                    : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <RowActionsMenu>
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        href={admin.jobListings.edit(
                                                            listing.id,
                                                        )}
                                                    >
                                                        <Pencil className="size-4" />
                                                        Edit
                                                    </Link>
                                                </DropdownMenuItem>
                                                <ConfirmDeleteDialog
                                                    url={toUrl(
                                                        admin.jobListings.destroy(
                                                            listing.id,
                                                        ),
                                                    )}
                                                    title="Delete job listing"
                                                    description={`Are you sure you want to delete "${listing.title}"? This cannot be undone.`}
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
                            <PaginationLinks links={jobListings.links} />
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

JobListingsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Job Listings', href: admin.jobListings.index() },
    ],
};
