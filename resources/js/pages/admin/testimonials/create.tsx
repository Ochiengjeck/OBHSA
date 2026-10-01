import { Head, useForm } from '@inertiajs/react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import {
    TestimonialForm,
    type TestimonialFormData,
} from '@/components/admin/testimonials/testimonial-form';
import admin from '@/routes/admin';

export default function TestimonialsCreate() {
    const { data, setData, post, processing, errors } =
        useForm<TestimonialFormData>({
            author_name: '',
            author_role: '',
            author_photo: null,
            quote: '',
            rating: 5,
            position: 0,
            is_featured: true,
        });

    function submit(event: React.FormEvent) {
        event.preventDefault();
        post(admin.testimonials.store().url, { forceFormData: true });
    }

    return (
        <>
            <Head title="New Testimonial" />
            <div className="p-4 sm:p-6">
                <AdminPageHeader title="New Testimonial" />
                <form onSubmit={submit}>
                    <TestimonialForm
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        submitLabel="Create Testimonial"
                    />
                </form>
            </div>
        </>
    );
}

TestimonialsCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Testimonials', href: admin.testimonials.index() },
        { title: 'New', href: admin.testimonials.create() },
    ],
};
