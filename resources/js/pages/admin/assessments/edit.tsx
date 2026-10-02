import { Head, useForm } from '@inertiajs/react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import {
    AssessmentForm,
    type AssessmentFormData,
} from '@/components/admin/assessments/assessment-form';
import admin from '@/routes/admin';
import type { Assessment } from '@/types';

export default function AssessmentsEdit({
    assessment,
}: {
    assessment: Assessment;
}) {
    const { data, setData, put, processing, errors } =
        useForm<AssessmentFormData>({
            name: assessment.name,
            description: assessment.description ?? '',
            delivery_mode: assessment.delivery_mode,
            passing_score: assessment.passing_score,
            max_attempts: assessment.max_attempts,
            is_active: assessment.is_active,
        });

    function submit(event: React.FormEvent) {
        event.preventDefault();
        put(admin.assessments.update(assessment.id).url);
    }

    return (
        <>
            <Head title={`Edit ${assessment.name}`} />
            <div className="p-4 sm:p-6">
                <AdminPageHeader title={`Edit: ${assessment.name}`} />
                <form onSubmit={submit}>
                    <AssessmentForm
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

AssessmentsEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Assessments', href: admin.assessments.index() },
    ],
};
