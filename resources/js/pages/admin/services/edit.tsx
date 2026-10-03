import { Head, useForm } from '@inertiajs/react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import {
    ServiceForm,
    type ServiceFormData,
} from '@/components/admin/services/service-form';
import { useStorageUrl } from '@/hooks/use-storage-url';
import admin from '@/routes/admin';
import type { Service } from '@/types';

export default function ServicesEdit({ service }: { service: Service }) {
    const storageUrl = useStorageUrl();
    const { data, setData, put, processing, errors } = useForm<ServiceFormData>(
        {
            title: service.title,
            summary: service.summary,
            description: service.description ?? '',
            icon: service.icon ?? '',
            icon_path: service.icon_path,
            icon_image: null,
            image: null,
            position: service.position,
            is_active: service.is_active,
        },
    );

    function submit(event: React.FormEvent) {
        event.preventDefault();
        put(admin.services.update(service.id).url, { forceFormData: true });
    }

    return (
        <>
            <Head title={`Edit ${service.title}`} />
            <div className="p-4 sm:p-6">
                <AdminPageHeader title={`Edit: ${service.title}`} />
                <form onSubmit={submit}>
                    <ServiceForm
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        imagePreview={storageUrl(service.image_path)}
                        submitLabel="Save Changes"
                    />
                </form>
            </div>
        </>
    );
}

ServicesEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Services', href: admin.services.index() },
    ],
};
