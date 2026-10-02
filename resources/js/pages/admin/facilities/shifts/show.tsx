import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { StatusBadge } from '@/components/admin/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import admin from '@/routes/admin';
import type { AssignableEmployee, Shift } from '@/types';

export default function ShiftShow({
    shift,
    availableEmployees,
}: {
    shift: Shift;
    availableEmployees: AssignableEmployee[];
}) {
    const [showAssignPanel, setShowAssignPanel] = useState(false);

    const assignForm = useForm({
        employee_id: null as number | null,
    });

    function submitAssign(event: React.FormEvent) {
        event.preventDefault();
        assignForm.post(admin.shifts.assignments.store(shift.id).url, {
            preserveScroll: true,
            onSuccess: () => {
                assignForm.reset();
                setShowAssignPanel(false);
            },
        });
    }

    function updateAssignmentStatus(
        assignmentId: number,
        status: 'confirmed' | 'completed' | 'no_show' | 'cancelled',
    ) {
        router.put(
            admin.shiftAssignments.update(assignmentId).url,
            { status },
            { preserveScroll: true },
        );
    }

    return (
        <>
            <Head title={`Shift — ${shift.facility?.name}`} />
            <div className="space-y-6 p-4 sm:p-6">
                <Button variant="ghost" size="sm" asChild className="-ml-3">
                    <Link
                        href={admin.facilities.shifts.index(shift.facility_id)}
                    >
                        <ArrowLeft className="size-4" />
                        All Shifts
                    </Link>
                </Button>

                <AdminPageHeader
                    title={`${shift.facility?.name} — ${new Date(
                        shift.shift_date,
                    ).toLocaleDateString()}`}
                    description={`${shift.start_time} – ${shift.end_time} · ${shift.specialty.replaceAll('_', ' ')}`}
                    action={<StatusBadge status={shift.status} />}
                />

                <Card>
                    <CardHeader className="flex-row items-center justify-between space-y-0">
                        <CardTitle>
                            Assignments ({shift.assignments?.length ?? 0} /{' '}
                            {shift.slots_needed})
                        </CardTitle>
                        {shift.status !== 'cancelled' && (
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                    setShowAssignPanel(!showAssignPanel)
                                }
                            >
                                {showAssignPanel ? 'Cancel' : 'Assign Employee'}
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {showAssignPanel && (
                            <form
                                onSubmit={submitAssign}
                                className="space-y-3 rounded-lg border border-border p-3"
                            >
                                <Label>Employee</Label>
                                <Select
                                    value={
                                        assignForm.data.employee_id
                                            ? String(
                                                  assignForm.data.employee_id,
                                              )
                                            : undefined
                                    }
                                    onValueChange={(value) =>
                                        assignForm.setData(
                                            'employee_id',
                                            Number(value),
                                        )
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select an available employee" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableEmployees.map((employee) => (
                                            <SelectItem
                                                key={employee.id}
                                                value={String(employee.id)}
                                            >
                                                {employee.candidate.full_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button
                                    type="submit"
                                    size="sm"
                                    disabled={
                                        assignForm.processing ||
                                        !assignForm.data.employee_id
                                    }
                                >
                                    {assignForm.processing
                                        ? 'Assigning...'
                                        : 'Assign'}
                                </Button>
                            </form>
                        )}

                        {!shift.assignments ||
                        shift.assignments.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                No one assigned yet.
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {shift.assignments.map((assignment) => (
                                    <div
                                        key={assignment.id}
                                        className="flex items-center justify-between rounded-md border border-border p-2 text-sm"
                                    >
                                        <div>
                                            <p className="font-medium text-foreground">
                                                {
                                                    assignment.employee
                                                        .candidate.full_name
                                                }
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Assigned{' '}
                                                {new Date(
                                                    assignment.assigned_at,
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {assignment.status ===
                                                'assigned' && (
                                                <button
                                                    type="button"
                                                    className="text-xs font-medium text-primary hover:underline"
                                                    onClick={() =>
                                                        updateAssignmentStatus(
                                                            assignment.id,
                                                            'confirmed',
                                                        )
                                                    }
                                                >
                                                    Confirm
                                                </button>
                                            )}
                                            {(assignment.status ===
                                                'assigned' ||
                                                assignment.status ===
                                                    'confirmed') && (
                                                <>
                                                    <button
                                                        type="button"
                                                        className="text-xs font-medium text-primary hover:underline"
                                                        onClick={() =>
                                                            updateAssignmentStatus(
                                                                assignment.id,
                                                                'completed',
                                                            )
                                                        }
                                                    >
                                                        Complete
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="text-xs font-medium text-destructive hover:underline"
                                                        onClick={() =>
                                                            updateAssignmentStatus(
                                                                assignment.id,
                                                                'no_show',
                                                            )
                                                        }
                                                    >
                                                        No Show
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="text-xs font-medium text-muted-foreground hover:underline"
                                                        onClick={() =>
                                                            updateAssignmentStatus(
                                                                assignment.id,
                                                                'cancelled',
                                                            )
                                                        }
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            )}
                                            <StatusBadge
                                                status={assignment.status}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {shift.notes && (
                    <>
                        <Separator />
                        <p className="text-sm text-muted-foreground">
                            {shift.notes}
                        </p>
                    </>
                )}
            </div>
        </>
    );
}

ShiftShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Facilities', href: admin.facilities.index() },
    ],
};
