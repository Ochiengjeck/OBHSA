import { Link } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, Calendar, Clock } from 'lucide-react';
import { PageHead } from '@/components/public/page-head';
import { Button } from '@/components/ui/button';
import { useStorageUrl } from '@/hooks/use-storage-url';
import { index } from '@/routes/blog';
import { index as jobsIndex } from '@/routes/jobs';
import type { BlogPost } from '@/types';

function estimateReadingMinutes(body: string) {
    const words = body.trim().split(/\s+/).filter(Boolean).length;

    return Math.max(1, Math.round(words / 200));
}

export default function BlogShow({ post }: { post: BlogPost }) {
    const storageUrl = useStorageUrl();
    const paragraphs = post.body.split(/\n{2,}/).filter(Boolean);
    const readingMinutes = estimateReadingMinutes(post.body);

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

                {post.featured_image_path ? (
                    <img
                        src={storageUrl(post.featured_image_path) ?? undefined}
                        alt=""
                        className="mt-6 aspect-21/9 w-full rounded-2xl object-cover shadow-md"
                    />
                ) : (
                    <div
                        aria-hidden
                        className="mt-6 aspect-21/9 w-full rounded-2xl bg-gradient-to-br from-primary/15 to-accent/30"
                    />
                )}

                <h1 className="mt-8 text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">
                    {post.title}
                </h1>

                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                    {post.published_at && (
                        <span className="inline-flex items-center gap-1.5">
                            <Calendar className="size-4" />
                            {new Date(post.published_at).toLocaleDateString(
                                undefined,
                                {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                },
                            )}
                        </span>
                    )}
                    <span className="inline-flex items-center gap-1.5">
                        <Clock className="size-4" />
                        {readingMinutes} min read
                    </span>
                </div>

                <div className="mt-10 space-y-6 text-lg leading-relaxed text-foreground">
                    {paragraphs.map((paragraph, index) => (
                        <p key={index} className="whitespace-pre-line">
                            {paragraph}
                        </p>
                    ))}
                </div>

                <div className="mt-16 flex flex-col items-start gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="font-semibold text-foreground">
                            Looking for flexible shifts?
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Browse open per-diem RN, LPN, and CNA positions with
                            OBHSA.
                        </p>
                    </div>
                    <Button asChild className="shrink-0">
                        <Link href={jobsIndex()}>
                            Browse Open Shifts
                            <ArrowRight className="size-4" />
                        </Link>
                    </Button>
                </div>
            </article>
        </>
    );
}
