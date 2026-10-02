import { Head, useForm } from '@inertiajs/react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import {
    FacilityForm,
    type FacilityFormData,
} from '@/components/admin/facilities/facility-form';
import admin from '@/routes/admin';

export default function FacilitiesCreate() {
    const { data, setData, post, processing, errors } =
        useForm<FacilityFormData>({
            name: '',
            address_line1: '',
            city: '',
            state: '',
            postal_code: '',
            contact_name: '',
            contact_phone: '',
            contact_email: '',
            facility_type: 'hospital',
            is_active: true,
        });

    function submit(event: React.FormEvent) {
        event.preventDefault();
        post(admin.facilities.store().url);
    }

    return (
        <>
            <Head title="New Facility" />
            <div className="p-4 sm:p-6">
                <AdminPageHeader title="New Facility" />
                <form onSubmit={submit}>
                    <FacilityForm
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        submitLabel="Create Facility"
                    />
                </form>
            </div>
        </>
    );
}

FacilitiesCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Facilities', href: admin.facilities.index() },
        { title: 'New', href: admin.facilities.create() },
    ],
};
