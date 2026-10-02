import { Head, useForm } from '@inertiajs/react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import {
    InterviewQuestionForm,
    type InterviewQuestionFormData,
} from '@/components/admin/interview-questions/interview-question-form';
import admin from '@/routes/admin';

export default function InterviewQuestionsCreate() {
    const { data, setData, post, processing, errors } =
        useForm<InterviewQuestionFormData>({
            question: '',
            specialty: '',
            is_active: true,
            position: 0,
        });

    function submit(event: React.FormEvent) {
        event.preventDefault();
        post(admin.interviewQuestions.store().url);
    }

    return (
        <>
            <Head title="New Interview Question" />
            <div className="p-4 sm:p-6">
                <AdminPageHeader title="New Interview Question" />
                <form onSubmit={submit}>
                    <InterviewQuestionForm
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        submitLabel="Create Question"
                    />
                </form>
            </div>
        </>
    );
}

InterviewQuestionsCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        {
            title: 'Interview Questions',
            href: admin.interviewQuestions.index(),
        },
        { title: 'New', href: admin.interviewQuestions.create() },
    ],
};
