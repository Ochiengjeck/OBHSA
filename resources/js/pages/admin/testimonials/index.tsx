import { Head, Link } from '@inertiajs/react';
import { MessageSquareQuote, Pencil, Plus, Trash2 } from 'lucide-react';
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
import { TwoLineCell } from '@/components/admin/two-line-cell';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { useStorageUrl } from '@/hooks/use-storage-url';
import { toUrl } from '@/lib/utils';
import admin from '@/routes/admin';
import type { Paginated, Testimonial } from '@/types';
import { PaginationLinks } from '@/components/pagination-links';

export default function TestimonialsIndex({
    testimonials,
    filters,
}: {
    testimonials: Paginated<Testimonial>;
    filters: { search: string | null };
}) {
    const storageUrl = useStorageUrl();
    const { search, setSearch } = useDebouncedSearch(
        admin.testimonials.index().url,
        filters,
    );

    return (
        <>
            <Head title="Testimonials" />
            <div className="p-4 sm:p-6">
                <AdminPageHeader
                    title="Testimonials"
                    description="Manage the quotes shown on the public site."
                    icon={MessageSquareQuote}
                    stats={[{ label: 'total', value: testimonials.total }]}
                    action={
                        <Button asChild>
                            <Link href={admin.testimonials.create()}>
                                <Plus className="size-4" />
                                New Testimonial
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
                        placeholder="Search by author..."
                    />
                </AdminFilterToolbar>

                {testimonials.data.length === 0 ? (
                    <EmptyState
                        icon={MessageSquareQuote}
                        title={
                            filters.search
                                ? 'No testimonials match your search'
                                : 'No testimonials yet'
                        }
                        description={
                            filters.search
                                ? 'Try a different search term.'
                                : 'Add your first testimonial to show it on the public site.'
                        }
                        action={
                            !filters.search && (
                                <Button asChild>
                                    <Link href={admin.testimonials.create()}>
                                        <Plus className="size-4" />
                                        New Testimonial
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
                                    <TableHead>Author</TableHead>
                                    <TableHead>Quote</TableHead>
                                    <TableHead>Featured</TableHead>
                                    <TableHead className="w-0" />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {testimonials.data.map((testimonial) => (
                                    <ClickableTableRow
                                        key={testimonial.id}
                                        href={toUrl(
                                            admin.testimonials.edit(
                                                testimonial.id,
                                            ),
                                        )}
                                    >
                                        <TableCell className="font-medium">
                                            <TwoLineCell
                                                avatar={
                                                    <Avatar className="size-8">
                                                        <AvatarImage
                                                            src={
                                                                storageUrl(
                                                                    testimonial.author_photo_path,
                                                                ) ?? undefined
                                                            }
                                                            alt=""
                                                        />
                                                        <AvatarFallback>
                                                            {testimonial.author_name
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                }
                                                primary={
                                                    testimonial.author_name
                                                }
                                                secondary={
                                                    testimonial.author_role
                                                }
                                            />
                                        </TableCell>
                                        <TableCell className="max-w-sm truncate text-muted-foreground">
                                            {testimonial.quote}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    testimonial.is_featured
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                            >
                                                {testimonial.is_featured
                                                    ? 'Featured'
                                                    : 'Hidden'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <RowActionsMenu>
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        href={admin.testimonials.edit(
                                                            testimonial.id,
                                                        )}
                                                    >
                                                        <Pencil className="size-4" />
                                                        Edit
                                                    </Link>
                                                </DropdownMenuItem>
                                                <ConfirmDeleteDialog
                                                    url={toUrl(
                                                        admin.testimonials.destroy(
                                                            testimonial.id,
                                                        ),
                                                    )}
                                                    title="Delete testimonial"
                                                    description={`Are you sure you want to delete this testimonial from "${testimonial.author_name}"? This cannot be undone.`}
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
                            <PaginationLinks links={testimonials.links} />
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

TestimonialsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Testimonials', href: admin.testimonials.index() },
    ],
};
