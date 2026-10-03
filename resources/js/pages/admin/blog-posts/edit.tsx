import { Head, useForm } from '@inertiajs/react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import {
    BlogPostForm,
    type BlogPostFormData,
} from '@/components/admin/blog-posts/blog-post-form';
import { useStorageUrl } from '@/hooks/use-storage-url';
import admin from '@/routes/admin';
import type { BlogPost } from '@/types';

export default function BlogPostsEdit({ post }: { post: BlogPost }) {
    const storageUrl = useStorageUrl();
    const { data, setData, put, processing, errors } =
        useForm<BlogPostFormData>({
            title: post.title,
            excerpt: post.excerpt ?? '',
            body: post.body,
            featured_image: null,
            is_published: post.is_published,
            published_at: post.published_at?.slice(0, 10) ?? '',
        });

    function submit(event: React.FormEvent) {
        event.preventDefault();
        put(admin.blogPosts.update(post.id).url, { forceFormData: true });
    }

    return (
        <>
            <Head title={`Edit ${post.title}`} />
            <div className="p-4 sm:p-6">
                <AdminPageHeader title={`Edit: ${post.title}`} />
                <form onSubmit={submit}>
                    <BlogPostForm
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        imagePreview={storageUrl(post.featured_image_path)}
                        submitLabel="Save Changes"
                    />
                </form>
            </div>
        </>
    );
}

BlogPostsEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Blog Posts', href: admin.blogPosts.index() },
    ],
};
