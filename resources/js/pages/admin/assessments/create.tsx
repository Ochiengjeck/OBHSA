import { Head, useForm } from '@inertiajs/react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import {
    AssessmentForm,
    type AssessmentFormData,
} from '@/components/admin/assessments/assessment-form';
import admin from '@/routes/admin';

export default function AssessmentsCreate() {
    const { data, setData, post, processing, errors } =
        useForm<AssessmentFormData>({
            name: '',
            description: '',
            delivery_mode: 'self_service',
            passing_score: 70,
            max_attempts: 1,
            is_active: true,
        });

    function submit(event: React.FormEvent) {
        event.preventDefault();
        post(admin.assessments.store().url);
    }

    return (
        <>
            <Head title="New Assessment" />
            <div className="p-4 sm:p-6">
                <AdminPageHeader title="New Assessment" />
                <form onSubmit={submit}>
                    <AssessmentForm
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        submitLabel="Create Assessment"
                    />
                </form>
            </div>
        </>
    );
}

AssessmentsCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Assessments', href: admin.assessments.index() },
        { title: 'New', href: admin.assessments.create() },
    ],
};
