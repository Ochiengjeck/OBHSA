import { Head, Link } from '@inertiajs/react';
import { Building2, Pencil, Plus, Search, Trash2 } from 'lucide-react';
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
import type { Facility, Paginated } from '@/types';
import { PaginationLinks } from '@/components/pagination-links';

export default function FacilitiesIndex({
    facilities,
    filters,
}: {
    facilities: Paginated<Facility>;
    filters: { search: string | null };
}) {
    const { search, setSearch } = useDebouncedSearch(
        admin.facilities.index().url,
        filters,
    );

    return (
        <>
            <Head title="Facilities" />
            <div className="p-4 sm:p-6">
                <AdminPageHeader
                    title="Facilities"
                    description="Client facilities OBHSA staffs shifts for."
                    icon={Building2}
                    stats={[{ label: 'total', value: facilities.total }]}
                    action={
                        <Button asChild>
                            <Link href={admin.facilities.create()}>
                                <Plus className="size-4" />
                                New Facility
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
                            placeholder="Search facilities..."
                            className="pl-8"
                        />
                    </div>
                </div>

                {facilities.data.length === 0 ? (
                    <EmptyState
                        icon={Building2}
                        title={
                            filters.search
                                ? 'No facilities match your search'
                                : 'No facilities yet'
                        }
                        description={
                            filters.search
                                ? 'Try a different search term.'
                                : 'Add a client facility to start scheduling shifts.'
                        }
                        action={
                            !filters.search && (
                                <Button asChild>
                                    <Link href={admin.facilities.create()}>
                                        <Plus className="size-4" />
                                        New Facility
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
                                    <TableHead>Location</TableHead>
                                    <TableHead>Shifts</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="w-0" />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {facilities.data.map((facility) => (
                                    <TableRow key={facility.id}>
                                        <TableCell className="font-medium">
                                            {facility.name}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {facility.city}, {facility.state}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            <Link
                                                href={admin.facilities.shifts.index(
                                                    facility.id,
                                                )}
                                                className="font-medium text-primary hover:underline"
                                            >
                                                {facility.shifts_count ?? 0}{' '}
                                                shifts
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    facility.is_active
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                            >
                                                {facility.is_active
                                                    ? 'Active'
                                                    : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <RowActionsMenu>
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        href={admin.facilities.edit(
                                                            facility.id,
                                                        )}
                                                    >
                                                        <Pencil className="size-4" />
                                                        Edit
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        href={admin.facilities.shifts.index(
                                                            facility.id,
                                                        )}
                                                    >
                                                        <Building2 className="size-4" />
                                                        Manage shifts
                                                    </Link>
                                                </DropdownMenuItem>
                                                <ConfirmDeleteDialog
                                                    url={toUrl(
                                                        admin.facilities.destroy(
                                                            facility.id,
                                                        ),
                                                    )}
                                                    title="Delete facility"
                                                    description={`Are you sure you want to delete "${facility.name}"? This cannot be undone.`}
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
                            <PaginationLinks links={facilities.links} />
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

FacilitiesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Facilities', href: admin.facilities.index() },
    ],
};
