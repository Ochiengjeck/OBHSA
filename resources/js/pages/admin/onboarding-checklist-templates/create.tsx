import { Head, useForm } from '@inertiajs/react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import {
    OnboardingChecklistTemplateForm,
    type OnboardingChecklistTemplateFormData,
} from '@/components/admin/onboarding/onboarding-checklist-template-form';
import admin from '@/routes/admin';

export default function OnboardingChecklistTemplatesCreate() {
    const { data, setData, post, processing, errors } =
        useForm<OnboardingChecklistTemplateFormData>({
            name: '',
            description: '',
            is_default: false,
            is_active: true,
        });

    function submit(event: React.FormEvent) {
        event.preventDefault();
        post(admin.onboardingChecklistTemplates.store().url);
    }

    return (
        <>
            <Head title="New Onboarding Checklist Template" />
            <div className="p-4 sm:p-6">
                <AdminPageHeader title="New Onboarding Checklist Template" />
                <form onSubmit={submit}>
                    <OnboardingChecklistTemplateForm
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

OnboardingChecklistTemplatesCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        {
            title: 'Onboarding Checklists',
            href: admin.onboardingChecklistTemplates.index(),
        },
        { title: 'New', href: admin.onboardingChecklistTemplates.create() },
    ],
};
