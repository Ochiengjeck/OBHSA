import { Head, useForm } from '@inertiajs/react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import {
    CommunicationTemplateForm,
    type CommunicationTemplateFormData,
} from '@/components/admin/communication-templates/communication-template-form';
import admin from '@/routes/admin';

export default function CommunicationTemplatesCreate() {
    const { data, setData, post, processing, errors } =
        useForm<CommunicationTemplateFormData>({
            name: '',
            subject: '',
            body: '',
        });

    function submit(event: React.FormEvent) {
        event.preventDefault();
        post(admin.communicationTemplates.store().url);
    }

    return (
        <>
            <Head title="New Template" />
            <div className="p-4 sm:p-6">
                <AdminPageHeader title="New Template" />
                <form onSubmit={submit}>
                    <CommunicationTemplateForm
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        submitLabel="Create Template"
                    />
                </form>
            </div>
        </>
    );
}

CommunicationTemplatesCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        {
            title: 'Message Templates',
            href: admin.communicationTemplates.index(),
        },
        { title: 'New', href: admin.communicationTemplates.create() },
    ],
};
