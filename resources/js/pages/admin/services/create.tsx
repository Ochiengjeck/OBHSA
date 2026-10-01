import { Head, useForm } from '@inertiajs/react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import {
    ServiceForm,
    type ServiceFormData,
} from '@/components/admin/services/service-form';
import admin from '@/routes/admin';

export default function ServicesCreate() {
    const { data, setData, post, processing, errors } =
        useForm<ServiceFormData>({
            title: '',
            summary: '',
            description: '',
            icon: '',
            image: null,
            position: 0,
            is_active: true,
        });

    function submit(event: React.FormEvent) {
        event.preventDefault();
        post(admin.services.store().url, { forceFormData: true });
    }

    return (
        <>
            <Head title="New Service" />
            <div className="p-4 sm:p-6">
                <AdminPageHeader title="New Service" />
                <form onSubmit={submit}>
                    <ServiceForm
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        submitLabel="Create Service"
                    />
                </form>
            </div>
        </>
    );
}

ServicesCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Services', href: admin.services.index() },
        { title: 'New', href: admin.services.create() },
    ],
};
