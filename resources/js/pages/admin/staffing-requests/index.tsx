import { Head, Link, router } from '@inertiajs/react';
import { Mail } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { EmptyState } from '@/components/admin/empty-state';
import { RowActionsMenu } from '@/components/admin/row-actions-menu';
import { StatusBadge } from '@/components/admin/status-badge';
import { PaginationLinks } from '@/components/pagination-links';
import {
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
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
import { toUrl } from '@/lib/utils';
import admin from '@/routes/admin';
import type { Paginated } from '@/types';

const STATUS_OPTIONS = ['new', 'contacted', 'qualified', 'closed'] as const;

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

    function changeStatus(requestId: number, status: string) {
        router.put(
            toUrl(admin.staffingRequests.update(requestId)),
            { status },
            { preserveScroll: true },
        );
    }

    return (
        <>
            <Head title="Staffing Requests" />
            <div className="p-4 sm:p-6">
                <AdminPageHeader
                    title="Staffing Requests"
                    description="Facility leads submitted through the staffing request form."
                    icon={Mail}
                    stats={[{ label: 'total', value: requests.total }]}
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

                {requests.data.length === 0 ? (
                    <EmptyState
                        icon={Mail}
                        title={
                            filters.status
                                ? 'No requests match this status'
                                : 'No staffing requests yet'
                        }
                        description={
                            filters.status
                                ? 'Try a different status or clear the filter.'
                                : 'Leads submitted through the staffing request form will show up here.'
                        }
                    />
                ) : (
                    <>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Facility</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Submitted</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="w-0" />
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
                                            <p className="text-xs">
                                                {request.email}
                                            </p>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {new Date(
                                                request.created_at,
                                            ).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <StatusBadge
                                                status={request.status}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <RowActionsMenu>
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        href={admin.staffingRequests.show(
                                                            request.id,
                                                        )}
                                                    >
                                                        View
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuLabel>
                                                    Set status
                                                </DropdownMenuLabel>
                                                {STATUS_OPTIONS.filter(
                                                    (status) =>
                                                        status !==
                                                        request.status,
                                                ).map((status) => (
                                                    <DropdownMenuItem
                                                        key={status}
                                                        onSelect={() =>
                                                            changeStatus(
                                                                request.id,
                                                                status,
                                                            )
                                                        }
                                                        className="capitalize"
                                                    >
                                                        {status}
                                                    </DropdownMenuItem>
                                                ))}
                                            </RowActionsMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <div className="mt-6">
                            <PaginationLinks links={requests.links} />
                        </div>
                    </>
                )}
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
