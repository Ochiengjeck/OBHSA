import { Head, useForm } from '@inertiajs/react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import {
    BlogPostForm,
    type BlogPostFormData,
} from '@/components/admin/blog-posts/blog-post-form';
import admin from '@/routes/admin';

export default function BlogPostsCreate() {
    const { data, setData, post, processing, errors } =
        useForm<BlogPostFormData>({
            title: '',
            excerpt: '',
            body: '',
            featured_image: null,
            is_published: false,
            published_at: '',
        });

    function submit(event: React.FormEvent) {
        event.preventDefault();
        post(admin.blogPosts.store().url, { forceFormData: true });
    }

    return (
        <>
            <Head title="New Post" />
            <div className="p-4 sm:p-6">
                <AdminPageHeader title="New Post" />
                <form onSubmit={submit}>
                    <BlogPostForm
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        submitLabel="Create Post"
                    />
                </form>
            </div>
        </>
    );
}

BlogPostsCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Blog Posts', href: admin.blogPosts.index() },
        { title: 'New', href: admin.blogPosts.create() },
    ],
};
