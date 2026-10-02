import { Head, useForm } from '@inertiajs/react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import {
    AssessmentQuestionForm,
    type AssessmentQuestionFormData,
} from '@/components/admin/assessments/assessment-question-form';
import admin from '@/routes/admin';
import type { Assessment, AssessmentQuestion } from '@/types';

export default function AssessmentQuestionsEdit({
    assessment,
    question,
}: {
    assessment: Assessment;
    question: AssessmentQuestion;
}) {
    const { data, setData, put, processing, errors } =
        useForm<AssessmentQuestionFormData>({
            question: question.question,
            question_type: question.question_type,
            options: question.options ?? ['', ''],
            correct_option: question.correct_option ?? '',
            points: question.points,
            position: question.position,
        });

    function submit(event: React.FormEvent) {
        event.preventDefault();
        put(admin.questions.update(question.id).url);
    }

    return (
        <>
            <Head title={`Edit Question — ${assessment.name}`} />
            <div className="p-4 sm:p-6">
                <AdminPageHeader title={`Edit Question: ${assessment.name}`} />
                <form onSubmit={submit}>
                    <AssessmentQuestionForm
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

AssessmentQuestionsEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Assessments', href: admin.assessments.index() },
    ],
};
