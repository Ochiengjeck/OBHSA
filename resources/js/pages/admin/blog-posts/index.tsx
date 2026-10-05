import { Head, Link } from '@inertiajs/react';
import { ExternalLink, Newspaper, Pencil, Plus, Trash2 } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { ClickableTableRow } from '@/components/admin/clickable-table-row';
import { ConfirmDeleteDialog } from '@/components/admin/confirm-delete-dialog';
import { EmptyState } from '@/components/admin/empty-state';
import {
    AdminFilterToolbar,
    ClearFiltersButton,
    ToolbarSearchInput,
} from '@/components/admin/filter-toolbar';
import { RowActionsMenu } from '@/components/admin/row-actions-menu';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useDebouncedSearch } from '@/hooks/use-debounced-search';
import { toUrl } from '@/lib/utils';
import admin from '@/routes/admin';
import { show as showOnSite } from '@/routes/blog';
import type { BlogPost, Paginated } from '@/types';
import { PaginationLinks } from '@/components/pagination-links';

export default function BlogPostsIndex({
    posts,
    filters,
}: {
    posts: Paginated<BlogPost>;
    filters: { search: string | null };
}) {
    const { search, setSearch } = useDebouncedSearch(
        admin.blogPosts.index().url,
        filters,
    );

    return (
        <>
            <Head title="Blog Posts" />
            <div className="p-4 sm:p-6">
                <AdminPageHeader
                    title="Blog Posts"
                    description="Manage articles shown on the public blog."
                    icon={Newspaper}
                    stats={[{ label: 'total', value: posts.total }]}
                    action={
                        <Button asChild>
                            <Link href={admin.blogPosts.create()}>
                                <Plus className="size-4" />
                                New Post
                            </Link>
                        </Button>
                    }
                />

                <AdminFilterToolbar
                    trailing={
                        search && (
                            <ClearFiltersButton onClick={() => setSearch('')} />
                        )
                    }
                >
                    <ToolbarSearchInput
                        value={search}
                        onChange={setSearch}
                        placeholder="Search posts..."
                    />
                </AdminFilterToolbar>

                {posts.data.length === 0 ? (
                    <EmptyState
                        icon={Newspaper}
                        title={
                            filters.search
                                ? 'No posts match your search'
                                : 'No blog posts yet'
                        }
                        description={
                            filters.search
                                ? 'Try a different search term.'
                                : 'Write your first post to show it on the public blog.'
                        }
                        action={
                            !filters.search && (
                                <Button asChild>
                                    <Link href={admin.blogPosts.create()}>
                                        <Plus className="size-4" />
                                        New Post
                                    </Link>
                                </Button>
                            )
                        }
                    />
                ) : (
                    <>
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
                                {posts.data.map((post) => (
                                    <ClickableTableRow
                                        key={post.id}
                                        href={toUrl(
                                            admin.blogPosts.edit(post.id),
                                        )}
                                    >
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
                                            <RowActionsMenu>
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        href={admin.blogPosts.edit(
                                                            post.id,
                                                        )}
                                                    >
                                                        <Pencil className="size-4" />
                                                        Edit
                                                    </Link>
                                                </DropdownMenuItem>
                                                {post.is_published && (
                                                    <DropdownMenuItem asChild>
                                                        <a
                                                            href={toUrl(
                                                                showOnSite(
                                                                    post.slug,
                                                                ),
                                                            )}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <ExternalLink className="size-4" />
                                                            View on site
                                                        </a>
                                                    </DropdownMenuItem>
                                                )}
                                                <ConfirmDeleteDialog
                                                    url={toUrl(
                                                        admin.blogPosts.destroy(
                                                            post.id,
                                                        ),
                                                    )}
                                                    title="Delete post"
                                                    description={`Are you sure you want to delete "${post.title}"? This cannot be undone.`}
                                                    trigger={
                                                        <DropdownMenuItem
                                                            variant="destructive"
                                                            onSelect={(e) =>
                                                                e.preventDefault()
                                                            }
                                                        >
                                                            <Trash2 className="size-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    }
                                                />
                                            </RowActionsMenu>
                                        </TableCell>
                                    </ClickableTableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <div className="mt-6">
                            <PaginationLinks links={posts.links} />
                        </div>
                    </>
                )}
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
