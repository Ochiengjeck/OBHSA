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
import type { Stat } from '@/types';

export default function StatsIndex({ stats }: { stats: Stat[] }) {
    return (
        <>
            <Head title="Stats" />
            <div className="p-4 sm:p-6">
                <AdminPageHeader
                    title="Stats"
                    description="Manage the trust-stat counters shown on the homepage."
                    action={
                        <Button asChild>
                            <Link href={admin.stats.create()}>
                                <Plus className="size-4" />
                                New Stat
                            </Link>
                        </Button>
                    }
                />

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
                        {stats.map((stat) => (
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
                                        {stat.is_active ? 'Active' : 'Inactive'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center justify-end gap-3">
                                        <Link
                                            href={admin.stats.edit(stat.id)}
                                            className="text-sm font-medium text-primary hover:underline"
                                        >
                                            Edit
                                        </Link>
                                        <ConfirmDeleteDialog
                                            url={toUrl(
                                                admin.stats.destroy(stat.id),
                                            )}
                                            title="Delete stat"
                                            description={`Are you sure you want to delete "${stat.label}"? This cannot be undone.`}
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

StatsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Stats', href: admin.stats.index() },
    ],
};
