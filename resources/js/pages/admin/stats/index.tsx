import { Head, Link } from '@inertiajs/react';
import { BarChart3, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { ConfirmDeleteDialog } from '@/components/admin/confirm-delete-dialog';
import { EmptyState } from '@/components/admin/empty-state';
import { RowActionsMenu } from '@/components/admin/row-actions-menu';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
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
import type { Paginated, Stat } from '@/types';
import { PaginationLinks } from '@/components/pagination-links';

export default function StatsIndex({
    stats,
    filters,
}: {
    stats: Paginated<Stat>;
    filters: { search: string | null };
}) {
    const { search, setSearch } = useDebouncedSearch(
        admin.stats.index().url,
        filters,
    );

    return (
        <>
            <Head title="Stats" />
            <div className="p-4 sm:p-6">
                <AdminPageHeader
                    title="Stats"
                    description="Manage the trust-stat counters shown on the homepage."
                    icon={BarChart3}
                    stats={[{ label: 'total', value: stats.total }]}
                    action={
                        <Button asChild>
                            <Link href={admin.stats.create()}>
                                <Plus className="size-4" />
                                New Stat
                            </Link>
                        </Button>
                    }
                />

                <div className="mb-4">
                    <div className="relative max-w-xs">
                        <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search stats..."
                            className="pl-8"
                        />
                    </div>
                </div>

                {stats.data.length === 0 ? (
                    <EmptyState
                        icon={BarChart3}
                        title={
                            filters.search
                                ? 'No stats match your search'
                                : 'No stats yet'
                        }
                        description={
                            filters.search
                                ? 'Try a different search term.'
                                : 'Add your first stat counter to show it on the homepage.'
                        }
                        action={
                            !filters.search && (
                                <Button asChild>
                                    <Link href={admin.stats.create()}>
                                        <Plus className="size-4" />
                                        New Stat
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
                                    <TableHead>Label</TableHead>
                                    <TableHead>Value</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="w-0" />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {stats.data.map((stat) => (
                                    <TableRow key={stat.id}>
                                        <TableCell className="font-medium">
                                            {stat.label}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {stat.value}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    stat.is_active
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                            >
                                                {stat.is_active
                                                    ? 'Active'
                                                    : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <RowActionsMenu>
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        href={admin.stats.edit(
                                                            stat.id,
                                                        )}
                                                    >
                                                        <Pencil className="size-4" />
                                                        Edit
                                                    </Link>
                                                </DropdownMenuItem>
                                                <ConfirmDeleteDialog
                                                    url={toUrl(
                                                        admin.stats.destroy(
                                                            stat.id,
                                                        ),
                                                    )}
                                                    title="Delete stat"
                                                    description={`Are you sure you want to delete "${stat.label}"? This cannot be undone.`}
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
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <div className="mt-6">
                            <PaginationLinks links={stats.links} />
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

StatsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Stats', href: admin.stats.index() },
    ],
};
