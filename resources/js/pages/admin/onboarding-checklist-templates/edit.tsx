import { Head, useForm } from '@inertiajs/react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import {
    OnboardingChecklistTemplateForm,
    type OnboardingChecklistTemplateFormData,
} from '@/components/admin/onboarding/onboarding-checklist-template-form';
import admin from '@/routes/admin';
import type { OnboardingChecklistTemplate } from '@/types';

export default function OnboardingChecklistTemplatesEdit({
    template,
}: {
    template: OnboardingChecklistTemplate;
}) {
    const { data, setData, put, processing, errors } =
        useForm<OnboardingChecklistTemplateFormData>({
            name: template.name,
            description: template.description ?? '',
            is_default: template.is_default,
            is_active: template.is_active,
        });

    function submit(event: React.FormEvent) {
        event.preventDefault();
        put(admin.onboardingChecklistTemplates.update(template.id).url);
    }

    return (
        <>
            <Head title={`Edit ${template.name}`} />
            <div className="p-4 sm:p-6">
                <AdminPageHeader title={`Edit: ${template.name}`} />
                <form onSubmit={submit}>
                    <OnboardingChecklistTemplateForm
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

OnboardingChecklistTemplatesEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        {
            title: 'Onboarding Checklists',
            href: admin.onboardingChecklistTemplates.index(),
        },
    ],
};
