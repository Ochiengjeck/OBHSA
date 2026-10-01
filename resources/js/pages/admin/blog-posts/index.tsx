import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { ConfirmDeleteDialog } from '@/components/admin/confirm-delete-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { toUrl } from '@/lib/utils';
import admin from '@/routes/admin';
import type { BlogPost } from '@/types';

export default function BlogPostsIndex({ posts }: { posts: BlogPost[] }) {
    return (
        <>
            <Head title="Blog Posts" />
            <div className="p-4 sm:p-6">
                <AdminPageHeader
                    title="Blog Posts"
                    description="Manage articles shown on the public blog."
                    action={
                        <Button asChild>
                            <Link href={admin.blogPosts.create()}>
                                <Plus className="size-4" />
                                New Post
                            </Link>
                        </Button>
                    }
                />

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Published</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-0" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {posts.map((post) => (
                            <TableRow key={post.id}>
                                <TableCell className="font-medium">
                                    {post.title}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {post.published_at
                                        ? new Date(
                                              post.published_at,
                                          ).toLocaleDateString()
                                        : '—'}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            post.is_published
                                                ? 'default'
                                                : 'secondary'
                                        }
                                    >
                                        {post.is_published
                                            ? 'Published'
                                            : 'Draft'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center justify-end gap-3">
                                        <Link
                                            href={admin.blogPosts.edit(post.id)}
                                            className="text-sm font-medium text-primary hover:underline"
                                        >
                                            Edit
                                        </Link>
                                        <ConfirmDeleteDialog
                                            url={toUrl(
                                                admin.blogPosts.destroy(
                                                    post.id,
                                                ),
                                            )}
                                            title="Delete post"
                                            description={`Are you sure you want to delete "${post.title}"? This cannot be undone.`}
                                            trigger={
                                                <button className="text-sm font-medium text-destructive hover:underline">
                                                    Delete
                                                </button>
                                            }
                                        />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    );
}

BlogPostsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Blog Posts', href: admin.blogPosts.index() },
    ],
};
