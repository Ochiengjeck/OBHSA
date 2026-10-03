import { Head, useForm } from '@inertiajs/react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import {
    TestimonialForm,
    type TestimonialFormData,
} from '@/components/admin/testimonials/testimonial-form';
import { storageUrl } from '@/lib/utils';
import admin from '@/routes/admin';
import type { Testimonial } from '@/types';

export default function TestimonialsEdit({
    testimonial,
}: {
    testimonial: Testimonial;
}) {
    const { data, setData, put, processing, errors } =
        useForm<TestimonialFormData>({
            author_name: testimonial.author_name,
            author_role: testimonial.author_role ?? '',
            author_photo: null,
            quote: testimonial.quote,
            rating: testimonial.rating ?? 5,
            position: testimonial.position,
            is_featured: testimonial.is_featured,
        });

    function submit(event: React.FormEvent) {
        event.preventDefault();
        put(admin.testimonials.update(testimonial.id).url, {
            forceFormData: true,
        });
    }

    return (
        <>
            <Head title={`Edit ${testimonial.author_name}`} />
            <div className="p-4 sm:p-6">
                <AdminPageHeader title={`Edit: ${testimonial.author_name}`} />
                <form onSubmit={submit}>
                    <TestimonialForm
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        photoPreview={storageUrl(testimonial.author_photo_path)}
                        submitLabel="Save Changes"
                    />
                </form>
            </div>
        </>
    );
}

TestimonialsEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Testimonials', href: admin.testimonials.index() },
    ],
};
