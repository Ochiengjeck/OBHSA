import { Head, useForm } from '@inertiajs/react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import {
    ShiftForm,
    type ShiftFormData,
} from '@/components/admin/facilities/shift-form';
import admin from '@/routes/admin';
import type { Facility } from '@/types';

export default function FacilityShiftsCreate({
    facility,
}: {
    facility: Facility;
}) {
    const { data, setData, post, processing, errors } = useForm<ShiftFormData>({
        specialty: '',
        shift_date: '',
        start_time: '',
        end_time: '',
        slots_needed: 1,
        pay_rate: '',
        notes: '',
    });

    function submit(event: React.FormEvent) {
        event.preventDefault();
        post(admin.facilities.shifts.store(facility.id).url);
    }

    return (
        <>
            <Head title={`Schedule Shift — ${facility.name}`} />
            <div className="p-4 sm:p-6">
                <AdminPageHeader title={`Schedule Shift: ${facility.name}`} />
                <form onSubmit={submit}>
                    <ShiftForm
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        submitLabel="Schedule Shift"
                    />
                </form>
            </div>
        </>
    );
}

FacilityShiftsCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Facilities', href: admin.facilities.index() },
    ],
};
