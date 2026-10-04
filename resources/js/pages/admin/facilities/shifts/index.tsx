import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, CalendarClock, Pencil, Plus, Trash2 } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { ConfirmDeleteDialog } from '@/components/admin/confirm-delete-dialog';
import { EmptyState } from '@/components/admin/empty-state';
import { RowActionsMenu } from '@/components/admin/row-actions-menu';
import { StatusBadge } from '@/components/admin/status-badge';
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
import type { Facility, Shift } from '@/types';

export default function FacilityShiftsIndex({
    facility,
    shifts,
}: {
    facility: Facility;
    shifts: Shift[];
}) {
    return (
        <>
            <Head title={`Shifts — ${facility.name}`} />
            <div className="p-4 sm:p-6">
                <Button variant="ghost" size="sm" asChild className="-ml-3">
                    <Link href={admin.facilities.index()}>
                        <ArrowLeft className="size-4" />
                        All Facilities
                    </Link>
                </Button>

                <AdminPageHeader
                    title={facility.name}
                    description="Shifts scheduled at this facility."
                    icon={CalendarClock}
                    stats={[{ label: 'total', value: shifts.length }]}
                    action={
                        <Button asChild>
                            <Link
                                href={admin.facilities.shifts.create(
                                    facility.id,
                                )}
                            >
                                <Plus className="size-4" />
                                Schedule Shift
                            </Link>
                        </Button>
                    }
                />

                {shifts.length === 0 ? (
                    <EmptyState
                        icon={CalendarClock}
                        title="No shifts scheduled"
                        description="Schedule a shift to start staffing this facility."
                        action={
                            <Button asChild>
                                <Link
                                    href={admin.facilities.shifts.create(
                                        facility.id,
                                    )}
                                >
                                    <Plus className="size-4" />
                                    Schedule Shift
                                </Link>
                            </Button>
                        }
                    />
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Time</TableHead>
                                <TableHead>Specialty</TableHead>
                                <TableHead>Slots</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-0" />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {shifts.map((shift) => (
                                <TableRow key={shift.id}>
                                    <TableCell>
                                        <Link
                                            href={admin.shifts.show(shift.id)}
                                            className="font-medium text-primary hover:underline"
                                        >
                                            {new Date(
                                                shift.shift_date,
                                            ).toLocaleDateString()}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {shift.start_time} – {shift.end_time}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground capitalize">
                                        {shift.specialty.replaceAll('_', ' ')}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {shift.assignments_count ?? 0} /{' '}
                                        {shift.slots_needed}
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge status={shift.status} />
                                    </TableCell>
                                    <TableCell>
                                        <RowActionsMenu>
                                            <DropdownMenuItem asChild>
                                                <Link
                                                    href={admin.shifts.edit(
                                                        shift.id,
                                                    )}
                                                >
                                                    <Pencil className="size-4" />
                                                    Edit
                                                </Link>
                                            </DropdownMenuItem>
                                            <ConfirmDeleteDialog
                                                url={toUrl(
                                                    admin.shifts.destroy(
                                                        shift.id,
                                                    ),
                                                )}
                                                title="Delete shift"
                                                description="Are you sure you want to delete this shift? This cannot be undone."
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

FacilityShiftsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Facilities', href: admin.facilities.index() },
    ],
};
