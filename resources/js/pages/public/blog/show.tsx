import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { PageHead } from '@/components/public/page-head';
import { Button } from '@/components/ui/button';
import { useStorageUrl } from '@/hooks/use-storage-url';
import { index } from '@/routes/blog';
import type { BlogPost } from '@/types';

export default function BlogShow({ post }: { post: BlogPost }) {
    const storageUrl = useStorageUrl();

    return (
        <>
            <PageHead
                title={post.title}
                description={post.excerpt ?? post.body.slice(0, 160)}
            />

            <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
                <Button variant="ghost" size="sm" asChild className="-ml-3">
                    <Link href={index()}>
                        <ArrowLeft className="size-4" />
                        All Posts
                    </Link>
                </Button>

                {post.featured_image_path && (
                    <img
                        src={storageUrl(post.featured_image_path) ?? undefined}
                        alt=""
                        className="mt-6 aspect-video w-full rounded-xl object-cover"
                    />
                )}

                <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground">
                    {post.title}
                </h1>

                {post.published_at && (
                    <p className="mt-2 text-sm text-muted-foreground">
                        {new Date(post.published_at).toLocaleDateString()}
                    </p>
                )}

                <div className="mt-8 max-w-none space-y-4 leading-relaxed whitespace-pre-line text-foreground">
                    {post.body}
                </div>
            </article>
        </>
    );
}
