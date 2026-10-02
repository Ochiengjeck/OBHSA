import { Head, useForm } from '@inertiajs/react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import {
    OnboardingChecklistTemplateItemForm,
    type OnboardingChecklistTemplateItemFormData,
} from '@/components/admin/onboarding/onboarding-checklist-template-item-form';
import admin from '@/routes/admin';
import type {
    OnboardingChecklistTemplate,
    OnboardingChecklistTemplateItem,
} from '@/types';

export default function OnboardingChecklistTemplateItemsEdit({
    template,
    item,
}: {
    template: OnboardingChecklistTemplate;
    item: OnboardingChecklistTemplateItem;
}) {
    const { data, setData, put, processing, errors } =
        useForm<OnboardingChecklistTemplateItemFormData>({
            task_key: item.task_key,
            label: item.label,
            is_blocking: item.is_blocking,
            position: item.position,
        });

    function submit(event: React.FormEvent) {
        event.preventDefault();
        put(admin.items.update(item.id).url);
    }

    return (
        <>
            <Head title={`Edit Checklist Item — ${template.name}`} />
            <div className="p-4 sm:p-6">
                <AdminPageHeader title={`Edit Item: ${template.name}`} />
                <form onSubmit={submit}>
                    <OnboardingChecklistTemplateItemForm
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

OnboardingChecklistTemplateItemsEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        {
            title: 'Onboarding Checklists',
            href: admin.onboardingChecklistTemplates.index(),
        },
    ],
};
