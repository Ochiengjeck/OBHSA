import { Head, Link, router } from '@inertiajs/react';
import { UserCheck } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { ClickableTableRow } from '@/components/admin/clickable-table-row';
import { EmptyState } from '@/components/admin/empty-state';
import {
    AdminFilterToolbar,
    ClearFiltersButton,
    ToolbarSearchInput,
} from '@/components/admin/filter-toolbar';
import { StatusBadge } from '@/components/admin/status-badge';
import { TwoLineCell } from '@/components/admin/two-line-cell';
import { PaginationLinks } from '@/components/pagination-links';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
import { useDebouncedSearch } from '@/hooks/use-debounced-search';
import { toUrl } from '@/lib/utils';
import admin from '@/routes/admin';
import type { EmployeeListRow, Paginated } from '@/types';

export default function EmployeesIndex({
    employees,
    filters,
}: {
    employees: Paginated<EmployeeListRow>;
    filters: { status: string | null; specialty: string | null };
}) {
    function updateFilters(patch: Partial<typeof filters>) {
        router.get(
            admin.employees.index().url,
            { ...filters, ...patch },
            { preserveState: true, replace: true },
        );
    }

    const { search: specialty, setSearch: setSpecialty } = useDebouncedSearch(
        admin.employees.index().url,
        filters,
        300,
        'specialty',
    );

    return (
        <>
            <Head title="Employees" />
            <div className="p-4 sm:p-6">
                <AdminPageHeader
                    title="Employees"
                    description="Caregivers activated from the application pipeline."
                    icon={UserCheck}
                    stats={[{ label: 'total', value: employees.total }]}
                />

                <AdminFilterToolbar
                    trailing={
                        (filters.status || specialty) && (
                            <ClearFiltersButton
                                onClick={() => {
                                    setSpecialty('');
                                    updateFilters({
                                        status: null,
                                        specialty: null,
                                    });
                                }}
                            />
                        )
                    }
                >
                    <Select
                        value={filters.status ?? 'all'}
                        onValueChange={(value) =>
                            updateFilters({
                                status: value === 'all' ? null : value,
                            })
                        }
                    >
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="All statuses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="terminated">
                                Terminated
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    <ToolbarSearchInput
                        value={specialty}
                        onChange={setSpecialty}
                        placeholder="Filter by specialty..."
                        className="w-56 sm:max-w-none"
                    />
                </AdminFilterToolbar>

                {employees.data.length === 0 ? (
                    <EmptyState
                        icon={UserCheck}
                        title="No employees match these filters"
                        description="Caregivers activated from the application pipeline will show up here."
                    />
                ) : (
                    <>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Employee</TableHead>
                                    <TableHead>Employee #</TableHead>
                                    <TableHead>Specialty</TableHead>
                                    <TableHead>Hire Date</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {employees.data.map((employee) => (
                                    <ClickableTableRow
                                        key={employee.id}
                                        href={toUrl(
                                            admin.employees.show(employee.id),
                                        )}
                                    >
                                        <TableCell>
                                            <TwoLineCell
                                                avatar={
                                                    <Avatar className="size-8">
                                                        <AvatarFallback>
                                                            {employee.candidate.full_name
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                }
                                                primary={
                                                    <Link
                                                        href={admin.employees.show(
                                                            employee.id,
                                                        )}
                                                        className="text-primary hover:underline"
                                                    >
                                                        {
                                                            employee.candidate
                                                                .full_name
                                                        }
                                                    </Link>
                                                }
                                                secondary={
                                                    employee.candidate.email
                                                }
                                            />
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {employee.employee_number ?? '—'}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {employee.specialty ?? '—'}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {new Date(
                                                employee.hire_date,
                                            ).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <StatusBadge
                                                status={employee.status}
                                            />
                                        </TableCell>
                                    </ClickableTableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <div className="mt-6">
                            <PaginationLinks links={employees.links} />
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

EmployeesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Employees', href: admin.employees.index() },
    ],
};
