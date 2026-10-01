import { Head, Link, router } from '@inertiajs/react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { StatusBadge } from '@/components/admin/status-badge';
import { PaginationLinks } from '@/components/pagination-links';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import admin from '@/routes/admin';
import type { Paginated } from '@/types';

type StaffingRequestRow = {
    id: number;
    facility_name: string;
    contact_name: string;
    email: string;
    status: string;
    created_at: string;
};

export default function StaffingRequestsIndex({
    requests,
    filters,
}: {
    requests: Paginated<StaffingRequestRow>;
    filters: { status: string | null };
}) {
    function updateStatusFilter(value: string) {
        router.get(
            admin.staffingRequests.index().url,
            { status: value === 'all' ? undefined : value },
            { preserveState: true, replace: true },
        );
    }

    return (
        <>
            <Head title="Staffing Requests" />
            <div className="p-4 sm:p-6">
                <AdminPageHeader
                    title="Staffing Requests"
                    description="Facility leads submitted through the staffing request form."
                />

                <div className="mb-4">
                    <Select
                        value={filters.status ?? 'all'}
                        onValueChange={updateStatusFilter}
                    >
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="All statuses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="contacted">Contacted</SelectItem>
                            <SelectItem value="qualified">Qualified</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Facility</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Submitted</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {requests.data.map((request) => (
                            <TableRow key={request.id}>
                                <TableCell>
                                    <Link
                                        href={admin.staffingRequests.show(
                                            request.id,
                                        )}
                                        className="font-medium text-primary hover:underline"
                                    >
                                        {request.facility_name}
                                    </Link>
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {request.contact_name}
                                    <p className="text-xs">{request.email}</p>
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {new Date(
                                        request.created_at,
                                    ).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    <StatusBadge status={request.status} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <div className="mt-6">
                    <PaginationLinks links={requests.links} />
                </div>
            </div>
        </>
    );
}

StaffingRequestsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Staffing Requests', href: admin.staffingRequests.index() },
    ],
};
