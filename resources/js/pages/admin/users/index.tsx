import { Head, Link, usePage } from '@inertiajs/react';
import { Pencil, Plus, Search, Trash2, Users as UsersIcon } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { ConfirmDeleteDialog } from '@/components/admin/confirm-delete-dialog';
import { EmptyState } from '@/components/admin/empty-state';
import { RowActionsMenu } from '@/components/admin/row-actions-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
import type { Auth, Paginated, StaffUser } from '@/types';
import { PaginationLinks } from '@/components/pagination-links';

export default function UsersIndex({
    users,
    filters,
}: {
    users: Paginated<StaffUser>;
    filters: { search: string | null };
}) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const { search, setSearch } = useDebouncedSearch(
        admin.users.index().url,
        filters,
    );

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

                <div className="mb-4">
                    <div className="relative max-w-xs">
                        <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name or email..."
                            className="pl-8"
                        />
                    </div>
                </div>

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
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead className="w-0" />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.data.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="size-8">
                                                    <AvatarFallback>
                                                        {user.name
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                {user.name}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {user.email}
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
                                    </TableRow>
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
