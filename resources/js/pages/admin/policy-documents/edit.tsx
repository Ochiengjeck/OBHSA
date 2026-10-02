import { Head, useForm } from '@inertiajs/react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import {
    PolicyDocumentForm,
    type PolicyDocumentFormData,
} from '@/components/admin/policy-documents/policy-document-form';
import admin from '@/routes/admin';
import type { PolicyDocument } from '@/types';

export default function PolicyDocumentsEdit({
    document,
}: {
    document: PolicyDocument;
}) {
    const { data, setData, put, processing, errors } =
        useForm<PolicyDocumentFormData>({
            title: document.title,
            body: document.body,
            is_active: document.is_active,
        });

    function submit(event: React.FormEvent) {
        event.preventDefault();
        put(admin.policyDocuments.update(document.id).url);
    }

    return (
        <>
            <Head title={`Edit ${document.title}`} />
            <div className="p-4 sm:p-6">
                <AdminPageHeader title={`Edit: ${document.title}`} />
                <form onSubmit={submit}>
                    <PolicyDocumentForm
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

PolicyDocumentsEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Policy Documents', href: admin.policyDocuments.index() },
    ],
};
