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
import type { Facility } from '@/types';

export default function FacilitiesIndex({
    facilities,
}: {
    facilities: Facility[];
}) {
    return (
        <>
            <Head title="Facilities" />
            <div className="p-4 sm:p-6">
                <AdminPageHeader
                    title="Facilities"
                    description="Client facilities OBHSA staffs shifts for."
                    action={
                        <Button asChild>
                            <Link href={admin.facilities.create()}>
                                <Plus className="size-4" />
                                New Facility
                            </Link>
                        </Button>
                    }
                />

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
                        {facilities.map((facility) => (
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
                                        {facility.shifts_count ?? 0} shifts
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
                                    <div className="flex items-center justify-end gap-3">
                                        <Link
                                            href={admin.facilities.edit(
                                                facility.id,
                                            )}
                                            className="text-sm font-medium text-primary hover:underline"
                                        >
                                            Edit
                                        </Link>
                                        <ConfirmDeleteDialog
                                            url={toUrl(
                                                admin.facilities.destroy(
                                                    facility.id,
                                                ),
                                            )}
                                            title="Delete facility"
                                            description={`Are you sure you want to delete "${facility.name}"? This cannot be undone.`}
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

FacilitiesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Facilities', href: admin.facilities.index() },
    ],
};
