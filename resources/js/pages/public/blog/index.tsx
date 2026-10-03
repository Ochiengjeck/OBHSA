import { Link } from '@inertiajs/react';
import { PageHead } from '@/components/public/page-head';
import { PaginationLinks } from '@/components/pagination-links';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { storageUrl } from '@/lib/utils';
import { show } from '@/routes/blog';
import type { BlogPost, Paginated } from '@/types';

export default function BlogIndex({ posts }: { posts: Paginated<BlogPost> }) {
    return (
        <>
            <PageHead
                title="Blog"
                description="Tips and resources for per-diem healthcare caregivers and facilities, from OBHSA."
            />

            <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold tracking-tight text-foreground">
                    Blog
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    Tips, insights, and resources for caregivers and facilities.
                </p>

                <div className="mt-10 space-y-6">
                    {posts.data.map((post) => (
                        <Link key={post.id} href={show(post.slug)}>
                            <Card className="flex-row overflow-hidden transition-shadow hover:shadow-md">
                                {post.featured_image_path ? (
                                    <img
                                        src={
                                            storageUrl(
                                                post.featured_image_path,
                                            ) ?? undefined
                                        }
                                        alt=""
                                        loading="lazy"
                                        className="h-32 w-32 shrink-0 object-cover sm:h-40 sm:w-48"
                                    />
                                ) : (
                                    <div
                                        aria-hidden
                                        className="h-32 w-32 shrink-0 bg-gradient-to-br from-primary/15 to-accent/30 sm:h-40 sm:w-48"
                                    />
                                )}
                                <div className="flex flex-1 flex-col">
                                    <CardHeader>
                                        <CardTitle>{post.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {post.excerpt && (
                                            <p className="text-sm text-muted-foreground">
                                                {post.excerpt}
                                            </p>
                                        )}
                                        {post.published_at && (
                                            <p className="mt-3 text-xs text-muted-foreground">
                                                {new Date(
                                                    post.published_at,
                                                ).toLocaleDateString()}
                                            </p>
                                        )}
                                    </CardContent>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>

                <div className="mt-10">
                    <PaginationLinks links={posts.links} />
                </div>
            </section>
        </>
    );
}
