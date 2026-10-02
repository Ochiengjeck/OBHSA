import { Head, useForm } from '@inertiajs/react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import {
    InterviewQuestionForm,
    type InterviewQuestionFormData,
} from '@/components/admin/interview-questions/interview-question-form';
import admin from '@/routes/admin';
import type { InterviewQuestion } from '@/types';

export default function InterviewQuestionsEdit({
    question,
}: {
    question: InterviewQuestion;
}) {
    const { data, setData, put, processing, errors } =
        useForm<InterviewQuestionFormData>({
            question: question.question,
            specialty: question.specialty ?? '',
            is_active: question.is_active,
            position: question.position,
        });

    function submit(event: React.FormEvent) {
        event.preventDefault();
        put(admin.interviewQuestions.update(question.id).url);
    }

    return (
        <>
            <Head title="Edit Interview Question" />
            <div className="p-4 sm:p-6">
                <AdminPageHeader title="Edit Interview Question" />
                <form onSubmit={submit}>
                    <InterviewQuestionForm
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

InterviewQuestionsEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        {
            title: 'Interview Questions',
            href: admin.interviewQuestions.index(),
        },
    ],
};
