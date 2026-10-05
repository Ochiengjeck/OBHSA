import { Head, Link } from '@inertiajs/react';
import { FileText } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { ClickableTableRow } from '@/components/admin/clickable-table-row';
import { EmptyState } from '@/components/admin/empty-state';
import { Badge } from '@/components/ui/badge';
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
import type { Page } from '@/types';

export default function PagesIndex({ pages }: { pages: Page[] }) {
    return (
        <>
            <Head title="Pages" />
            <div className="p-4 sm:p-6">
                <AdminPageHeader
                    title="Pages"
                    description="Edit the content sections for each fixed site page."
                    icon={FileText}
                    stats={[{ label: 'total', value: pages.length }]}
                />

                {pages.length === 0 ? (
                    <EmptyState
                        icon={FileText}
                        title="No pages yet"
                        description="Site pages will show up here."
                    />
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Page</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-0" />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pages.map((page) => (
                                <ClickableTableRow
                                    key={page.id}
                                    href={toUrl(admin.pages.edit(page.id))}
                                >
                                    <TableCell className="font-medium">
                                        {page.title}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                page.is_published
                                                    ? 'default'
                                                    : 'secondary'
                                            }
                                        >
                                            {page.is_published
                                                ? 'Published'
                                                : 'Unpublished'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Link
                                            href={admin.pages.edit(page.id)}
                                            className="text-sm font-medium text-primary hover:underline"
                                        >
                                            Edit
                                        </Link>
                                    </TableCell>
                                </ClickableTableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
        </>
    );
}

PagesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Pages', href: admin.pages.index() },
    ],
};
