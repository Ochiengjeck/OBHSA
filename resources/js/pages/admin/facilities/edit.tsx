import { Head, useForm } from '@inertiajs/react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import {
    FacilityForm,
    type FacilityFormData,
} from '@/components/admin/facilities/facility-form';
import admin from '@/routes/admin';
import type { Facility } from '@/types';

export default function FacilitiesEdit({ facility }: { facility: Facility }) {
    const { data, setData, put, processing, errors } =
        useForm<FacilityFormData>({
            name: facility.name,
            address_line1: facility.address_line1,
            city: facility.city,
            state: facility.state,
            postal_code: facility.postal_code,
            contact_name: facility.contact_name ?? '',
            contact_phone: facility.contact_phone ?? '',
            contact_email: facility.contact_email ?? '',
            facility_type: facility.facility_type,
            is_active: facility.is_active,
        });

    function submit(event: React.FormEvent) {
        event.preventDefault();
        put(admin.facilities.update(facility.id).url);
    }

    return (
        <>
            <Head title={`Edit ${facility.name}`} />
            <div className="p-4 sm:p-6">
                <AdminPageHeader title={`Edit: ${facility.name}`} />
                <form onSubmit={submit}>
                    <FacilityForm
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        submitLabel="Save Changes"
                    />
                </form>
            </div>
        </>
    );
}

FacilitiesEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Facilities', href: admin.facilities.index() },
    ],
};
