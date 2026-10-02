import { Head, useForm } from '@inertiajs/react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import {
    CommunicationTemplateForm,
    type CommunicationTemplateFormData,
} from '@/components/admin/communication-templates/communication-template-form';
import admin from '@/routes/admin';
import type { CommunicationTemplate } from '@/types';

export default function CommunicationTemplatesEdit({
    template,
}: {
    template: CommunicationTemplate;
}) {
    const { data, setData, put, processing, errors } =
        useForm<CommunicationTemplateFormData>({
            name: template.name,
            subject: template.subject,
            body: template.body,
        });

    function submit(event: React.FormEvent) {
        event.preventDefault();
        put(admin.communicationTemplates.update(template.id).url);
    }

    return (
        <>
            <Head title={`Edit ${template.name}`} />
            <div className="p-4 sm:p-6">
                <AdminPageHeader title={`Edit: ${template.name}`} />
                <form onSubmit={submit}>
                    <CommunicationTemplateForm
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

CommunicationTemplatesEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        {
            title: 'Message Templates',
            href: admin.communicationTemplates.index(),
        },
    ],
};
