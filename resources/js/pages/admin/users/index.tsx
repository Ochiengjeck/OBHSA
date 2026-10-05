import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash2, Users as UsersIcon } from 'lucide-react';
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
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
import type { Auth, Paginated, Role, StaffUser } from '@/types';
import { PaginationLinks } from '@/components/pagination-links';

export default function UsersIndex({
    users,
    roles,
    filters,
}: {
    users: Paginated<StaffUser>;
    roles: Role[];
    filters: { search: string | null; role: string | null };
}) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const { search, setSearch } = useDebouncedSearch(
        admin.users.index().url,
        filters,
    );

    function updateRoleFilter(value: string) {
        router.get(
            admin.users.index().url,
            { ...filters, role: value === 'all' ? undefined : value },
            { preserveState: true, replace: true },
        );
    }

    return (
        <>
            <Head title="Users" />
            <div className="p-4 sm:p-6">
                <AdminPageHeader
                    title="Users"
                    description="Manage backoffice staff accounts and roles."
                    icon={UsersIcon}
                    stats={[{ label: 'total', value: users.total }]}
                    action={
                        <Button asChild>
                            <Link href={admin.users.create()}>
                                <Plus className="size-4" />
                                New User
                            </Link>
                        </Button>
                    }
                />

                <AdminFilterToolbar
                    trailing={
                        (search || filters.role) && (
                            <ClearFiltersButton
                                onClick={() => {
                                    setSearch('');
                                    updateRoleFilter('all');
                                }}
                            />
                        )
                    }
                >
                    <ToolbarSearchInput
                        value={search}
                        onChange={setSearch}
                        placeholder="Search by name or email..."
                    />
                    <Select
                        value={filters.role ?? 'all'}
                        onValueChange={updateRoleFilter}
                    >
                        <SelectTrigger className="w-44">
                            <SelectValue placeholder="All roles" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Roles</SelectItem>
                            {roles.map((role) => (
                                <SelectItem
                                    key={role.id}
                                    value={role.name}
                                    className="capitalize"
                                >
                                    {role.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </AdminFilterToolbar>

                {users.data.length === 0 ? (
                    <EmptyState
                        icon={UsersIcon}
                        title={
                            filters.search
                                ? 'No users match your search'
                                : 'No staff accounts yet'
                        }
                        description={
                            filters.search
                                ? 'Try a different search term.'
                                : 'Create a staff account to give someone backoffice access.'
                        }
                        action={
                            !filters.search && (
                                <Button asChild>
                                    <Link href={admin.users.create()}>
                                        <Plus className="size-4" />
                                        New User
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
                                    <TableHead>Name</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Joined</TableHead>
                                    <TableHead className="w-0" />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.data.map((user) => (
                                    <ClickableTableRow
                                        key={user.id}
                                        href={toUrl(admin.users.edit(user.id))}
                                    >
                                        <TableCell className="font-medium">
                                            <TwoLineCell
                                                avatar={
                                                    <Avatar className="size-8">
                                                        <AvatarFallback>
                                                            {user.name
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                }
                                                primary={user.name}
                                                secondary={user.email}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {user.roles.map((role) => (
                                                <Badge
                                                    key={role.id}
                                                    variant="secondary"
                                                    className="capitalize"
                                                >
                                                    {role.name}
                                                </Badge>
                                            ))}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {new Date(
                                                user.created_at,
                                            ).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <RowActionsMenu>
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        href={admin.users.edit(
                                                            user.id,
                                                        )}
                                                    >
                                                        <Pencil className="size-4" />
                                                        Edit
                                                    </Link>
                                                </DropdownMenuItem>
                                                {user.id !== auth.user.id && (
                                                    <ConfirmDeleteDialog
                                                        url={toUrl(
                                                            admin.users.destroy(
                                                                user.id,
                                                            ),
                                                        )}
                                                        title="Delete staff account"
                                                        description={`Are you sure you want to delete "${user.name}"? This cannot be undone.`}
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
                                                )}
                                            </RowActionsMenu>
                                        </TableCell>
                                    </ClickableTableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <div className="mt-6">
                            <PaginationLinks links={users.links} />
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

UsersIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Users', href: admin.users.index() },
    ],
};
