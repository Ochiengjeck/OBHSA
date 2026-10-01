import { Head, Link, usePage } from '@inertiajs/react';
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
import type { Auth, StaffUser } from '@/types';

export default function UsersIndex({ users }: { users: StaffUser[] }) {
    const { auth } = usePage<{ auth: Auth }>().props;

    return (
        <>
            <Head title="Users" />
            <div className="p-4 sm:p-6">
                <AdminPageHeader
                    title="Users"
                    description="Manage backoffice staff accounts and roles."
                    action={
                        <Button asChild>
                            <Link href={admin.users.create()}>
                                <Plus className="size-4" />
                                New User
                            </Link>
                        </Button>
                    }
                />

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
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">
                                    {user.name}
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
                                    <div className="flex items-center justify-end gap-3">
                                        <Link
                                            href={admin.users.edit(user.id)}
                                            className="text-sm font-medium text-primary hover:underline"
                                        >
                                            Edit
                                        </Link>
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
                                                    <button className="text-sm font-medium text-destructive hover:underline">
                                                        Delete
                                                    </button>
                                                }
                                            />
                                        )}
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

UsersIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Users', href: admin.users.index() },
    ],
};
