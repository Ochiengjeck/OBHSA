import { Link } from '@inertiajs/react';
import { ArrowRight, Newspaper } from 'lucide-react';
import { PageHead } from '@/components/public/page-head';
import { PaginationLinks } from '@/components/pagination-links';
import { useStorageUrl } from '@/hooks/use-storage-url';
import { show } from '@/routes/blog';
import type { BlogPost, Paginated } from '@/types';

function formatDate(date: string) {
    return new Date(date).toLocaleDateString(undefined, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
}

export default function BlogIndex({ posts }: { posts: Paginated<BlogPost> }) {
    const storageUrl = useStorageUrl();
    const featured = posts.current_page === 1 ? (posts.data[0] ?? null) : null;
    const rest = featured ? posts.data.slice(1) : posts.data;

    return (
        <>
            <PageHead
                title="Blog"
                description="Tips and resources for per-diem healthcare caregivers and facilities, from OBHSA."
            />

            <section className="border-b border-border/60 bg-gradient-to-b from-accent/25 to-background">
                <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        <Newspaper className="size-3.5" />
                        Resources &amp; Insights
                    </div>
                    <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                        Blog
                    </h1>
                    <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
                        Tips, insights, and resources for caregivers and
                        facilities.
                    </p>
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
                {featured && (
                    <Link
                        href={show(featured.slug)}
                        className="group grid gap-6 overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl md:grid-cols-2"
                    >
                        <div className="relative aspect-video overflow-hidden md:aspect-auto">
                            {featured.featured_image_path ? (
                                <img
                                    src={
                                        storageUrl(
                                            featured.featured_image_path,
                                        ) ?? undefined
                                    }
                                    alt=""
                                    loading="eager"
                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            ) : (
                                <div
                                    aria-hidden
                                    className="h-full w-full bg-gradient-to-br from-primary/15 to-accent/30"
                                />
                            )}
                        </div>
                        <div className="flex flex-col justify-center p-6 sm:p-8">
                            <span className="inline-flex w-fit items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                                Latest Post
                            </span>
                            <h2 className="mt-4 text-2xl font-bold tracking-tight text-balance text-foreground sm:text-3xl">
                                {featured.title}
                            </h2>
                            {featured.excerpt && (
                                <p className="mt-3 line-clamp-3 text-muted-foreground">
                                    {featured.excerpt}
                                </p>
                            )}
                            <div className="mt-5 flex items-center gap-4 text-sm text-muted-foreground">
                                {featured.published_at && (
                                    <span>
                                        {formatDate(featured.published_at)}
                                    </span>
                                )}
                                <span className="inline-flex items-center gap-1.5 font-medium text-primary">
                                    Read article
                                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                                </span>
                            </div>
                        </div>
                    </Link>
                )}

                {rest.length > 0 && (
                    <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {rest.map((post) => (
                            <Link
                                key={post.id}
                                href={show(post.slug)}
                                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
                            >
                                <div className="relative aspect-video overflow-hidden">
                                    {post.featured_image_path ? (
                                        <img
                                            src={
                                                storageUrl(
                                                    post.featured_image_path,
                                                ) ?? undefined
                                            }
                                            alt=""
                                            loading="lazy"
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div
                                            aria-hidden
                                            className="h-full w-full bg-gradient-to-br from-primary/15 to-accent/30"
                                        />
                                    )}
                                </div>
                                <div className="flex flex-1 flex-col p-5">
                                    <h3 className="line-clamp-2 text-lg font-semibold tracking-tight text-foreground">
                                        {post.title}
                                    </h3>
                                    {post.excerpt && (
                                        <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                                            {post.excerpt}
                                        </p>
                                    )}
                                    <div className="mt-auto flex items-center justify-between pt-5">
                                        {post.published_at && (
                                            <span className="text-xs text-muted-foreground">
                                                {formatDate(post.published_at)}
                                            </span>
                                        )}
                                        <ArrowRight className="size-4 text-primary transition-transform group-hover:translate-x-1" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {posts.data.length === 0 && (
                    <div className="flex flex-col items-center rounded-2xl border border-dashed border-border py-16 text-center">
                        <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Newspaper className="size-6" />
                        </div>
                        <h2 className="mt-4 text-lg font-semibold text-foreground">
                            No posts yet
                        </h2>
                        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                            Check back soon for tips and resources for
                            caregivers and facilities.
                        </p>
                    </div>
                )}

                <div className="mt-12">
                    <PaginationLinks links={posts.links} />
                </div>
            </section>
        </>
    );
}
