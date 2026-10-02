import { Head, useForm } from '@inertiajs/react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import {
    OnboardingChecklistTemplateItemForm,
    type OnboardingChecklistTemplateItemFormData,
} from '@/components/admin/onboarding/onboarding-checklist-template-item-form';
import admin from '@/routes/admin';
import type { OnboardingChecklistTemplate } from '@/types';

export default function OnboardingChecklistTemplateItemsCreate({
    template,
}: {
    template: OnboardingChecklistTemplate;
}) {
    const { data, setData, post, processing, errors } =
        useForm<OnboardingChecklistTemplateItemFormData>({
            task_key: '',
            label: '',
            is_blocking: true,
            position: 0,
        });

    function submit(event: React.FormEvent) {
        event.preventDefault();
        post(admin.onboardingChecklistTemplates.items.store(template.id).url);
    }

    return (
        <>
            <Head title={`New Checklist Item — ${template.name}`} />
            <div className="p-4 sm:p-6">
                <AdminPageHeader title={`New Item: ${template.name}`} />
                <form onSubmit={submit}>
                    <OnboardingChecklistTemplateItemForm
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        submitLabel="Add Item"
                    />
                </form>
            </div>
        </>
    );
}

OnboardingChecklistTemplateItemsCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        {
            title: 'Onboarding Checklists',
            href: admin.onboardingChecklistTemplates.index(),
        },
    ],
};
