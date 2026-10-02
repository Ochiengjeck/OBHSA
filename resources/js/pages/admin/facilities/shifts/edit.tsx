import { Head, useForm } from '@inertiajs/react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import {
    ShiftForm,
    type ShiftFormData,
} from '@/components/admin/facilities/shift-form';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import admin from '@/routes/admin';
import type { Facility, Shift } from '@/types';

export default function FacilityShiftsEdit({
    facility,
    shift,
}: {
    facility: Facility;
    shift: Shift;
}) {
    const { data, setData, put, processing, errors } = useForm<
        ShiftFormData & { status: string }
    >({
        specialty: shift.specialty,
        shift_date: shift.shift_date,
        start_time: shift.start_time,
        end_time: shift.end_time,
        slots_needed: shift.slots_needed,
        pay_rate: shift.pay_rate ?? '',
        notes: shift.notes ?? '',
        status: shift.status === 'cancelled' ? 'cancelled' : 'open',
    });

    function submit(event: React.FormEvent) {
        event.preventDefault();
        put(admin.shifts.update(shift.id).url);
    }

    return (
        <>
            <Head title={`Edit Shift — ${facility.name}`} />
            <div className="p-4 sm:p-6">
                <AdminPageHeader title={`Edit Shift: ${facility.name}`} />
                <form onSubmit={submit} className="max-w-xl space-y-5">
                    <ShiftForm
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        submitLabel="Save Changes"
                    />
                    {shift.status !== 'filled' && (
                        <div className="flex items-center gap-2">
                            <Switch
                                id="cancelled"
                                checked={data.status === 'cancelled'}
                                onCheckedChange={(checked) =>
                                    setData(
                                        'status',
                                        checked ? 'cancelled' : 'open',
                                    )
                                }
                            />
                            <Label htmlFor="cancelled">Cancel this shift</Label>
                        </div>
                    )}
                </form>
            </div>
        </>
    );
}

FacilityShiftsEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Facilities', href: admin.facilities.index() },
    ],
};
