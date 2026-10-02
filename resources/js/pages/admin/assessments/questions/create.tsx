import { Head, useForm } from '@inertiajs/react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import {
    AssessmentQuestionForm,
    type AssessmentQuestionFormData,
} from '@/components/admin/assessments/assessment-question-form';
import admin from '@/routes/admin';
import type { Assessment } from '@/types';

export default function AssessmentQuestionsCreate({
    assessment,
}: {
    assessment: Assessment;
}) {
    const { data, setData, post, processing, errors } =
        useForm<AssessmentQuestionFormData>({
            question: '',
            question_type: 'multiple_choice',
            options: ['', ''],
            correct_option: '',
            points: 1,
            position: 0,
        });

    function submit(event: React.FormEvent) {
        event.preventDefault();
        post(admin.assessments.questions.store(assessment.id).url);
    }

    return (
        <>
            <Head title={`New Question — ${assessment.name}`} />
            <div className="p-4 sm:p-6">
                <AdminPageHeader title={`New Question: ${assessment.name}`} />
                <form onSubmit={submit}>
                    <AssessmentQuestionForm
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        submitLabel="Add Question"
                    />
                </form>
            </div>
        </>
    );
}

AssessmentQuestionsCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Assessments', href: admin.assessments.index() },
    ],
};
