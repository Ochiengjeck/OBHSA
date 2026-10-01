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
import admin from '@/routes/admin';
import { toUrl } from '@/lib/utils';
import type { Service } from '@/types';

export default function ServicesIndex({ services }: { services: Service[] }) {
    return (
        <>
            <Head title="Services" />
            <div className="p-4 sm:p-6">
                <AdminPageHeader
                    title="Services"
                    description="Manage the staffing services shown on the public site."
                    action={
                        <Button asChild>
                            <Link href={admin.services.create()}>
                                <Plus className="size-4" />
                                New Service
                            </Link>
                        </Button>
                    }
                />

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Summary</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-0" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {services.map((service) => (
                            <TableRow key={service.id}>
                                <TableCell className="font-medium">
                                    {service.title}
                                </TableCell>
                                <TableCell className="max-w-sm truncate text-muted-foreground">
                                    {service.summary}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            service.is_active
                                                ? 'default'
                                                : 'secondary'
                                        }
                                    >
                                        {service.is_active
                                            ? 'Active'
                                            : 'Inactive'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center justify-end gap-3">
                                        <Link
                                            href={admin.services.edit(
                                                service.id,
                                            )}
                                            className="text-sm font-medium text-primary hover:underline"
                                        >
                                            Edit
                                        </Link>
                                        <ConfirmDeleteDialog
                                            url={toUrl(
                                                admin.services.destroy(
                                                    service.id,
                                                ),
                                            )}
                                            title="Delete service"
                                            description={`Are you sure you want to delete "${service.title}"? This cannot be undone.`}
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

ServicesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Services', href: admin.services.index() },
    ],
};
