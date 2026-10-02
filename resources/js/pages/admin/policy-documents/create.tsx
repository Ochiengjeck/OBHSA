import { Head, useForm } from '@inertiajs/react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import {
    PolicyDocumentForm,
    type PolicyDocumentFormData,
} from '@/components/admin/policy-documents/policy-document-form';
import admin from '@/routes/admin';

export default function PolicyDocumentsCreate() {
    const { data, setData, post, processing, errors } =
        useForm<PolicyDocumentFormData>({
            title: '',
            body: '',
            is_active: true,
        });

    function submit(event: React.FormEvent) {
        event.preventDefault();
        post(admin.policyDocuments.store().url);
    }

    return (
        <>
            <Head title="New Policy Document" />
            <div className="p-4 sm:p-6">
                <AdminPageHeader title="New Policy Document" />
                <form onSubmit={submit}>
                    <PolicyDocumentForm
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        submitLabel="Create Document"
                    />
                </form>
            </div>
        </>
    );
}

PolicyDocumentsCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Policy Documents', href: admin.policyDocuments.index() },
        { title: 'New', href: admin.policyDocuments.create() },
    ],
};
