import { Head, Link } from '@inertiajs/react';
import { Pencil, Plus, ShieldCheck, Trash2 } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { ClickableTableRow } from '@/components/admin/clickable-table-row';
import { ConfirmDeleteDialog } from '@/components/admin/confirm-delete-dialog';
import { EmptyState } from '@/components/admin/empty-state';
import { RowActionsMenu } from '@/components/admin/row-actions-menu';
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
import { toUrl } from '@/lib/utils';
import admin from '@/routes/admin';
import type { Role } from '@/types';

const PROTECTED_ROLE_NAMES = ['admin', 'editor'];

export default function RolesIndex({ roles }: { roles: Role[] }) {
    return (
        <>
            <Head title="Roles" />
            <div className="p-4 sm:p-6">
                <AdminPageHeader
                    title="Roles"
                    description="Manage roles and the permissions each one grants."
                    icon={ShieldCheck}
                    stats={[{ label: 'total', value: roles.length }]}
                    action={
                        <Button asChild>
                            <Link href={admin.roles.create()}>
                                <Plus className="size-4" />
                                New Role
                            </Link>
                        </Button>
                    }
                />

                {roles.length === 0 ? (
                    <EmptyState
                        icon={ShieldCheck}
                        title="No roles yet"
                        description="Create a role to start assigning permissions."
                        action={
                            <Button asChild>
                                <Link href={admin.roles.create()}>
                                    <Plus className="size-4" />
                                    New Role
                                </Link>
                            </Button>
                        }
                    />
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Permissions</TableHead>
                                <TableHead>Users</TableHead>
                                <TableHead className="w-0" />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {roles.map((role) => {
                                const isProtected =
                                    PROTECTED_ROLE_NAMES.includes(role.name);

                                return (
                                    <ClickableTableRow
                                        key={role.id}
                                        href={toUrl(admin.roles.edit(role.id))}
                                    >
                                        <TableCell className="font-medium capitalize">
                                            {role.name}
                                            {isProtected && (
                                                <Badge
                                                    variant="secondary"
                                                    className="ml-2"
                                                >
                                                    System
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {role.permissions_count ?? 0}{' '}
                                            permission
                                            {role.permissions_count === 1
                                                ? ''
                                                : 's'}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {role.users_count ?? 0} user
                                            {role.users_count === 1 ? '' : 's'}
                                        </TableCell>
                                        <TableCell>
                                            <RowActionsMenu>
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        href={admin.roles.edit(
                                                            role.id,
                                                        )}
                                                    >
                                                        <Pencil className="size-4" />
                                                        Edit
                                                    </Link>
                                                </DropdownMenuItem>
                                                {!isProtected &&
                                                    (role.users_count ?? 0) ===
                                                        0 && (
                                                        <ConfirmDeleteDialog
                                                            url={toUrl(
                                                                admin.roles.destroy(
                                                                    role.id,
                                                                ),
                                                            )}
                                                            title="Delete role"
                                                            description={`Are you sure you want to delete "${role.name}"? This cannot be undone.`}
                                                            trigger={
                                                                <DropdownMenuItem
                                                                    variant="destructive"
                                                                    onSelect={(
                                                                        e,
                                                                    ) =>
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
                                );
                            })}
                        </TableBody>
                    </Table>
                )}
            </div>
        </>
    );
}

RolesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Roles', href: admin.roles.index() },
    ],
};
