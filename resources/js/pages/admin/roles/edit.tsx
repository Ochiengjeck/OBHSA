import { Head, useForm } from '@inertiajs/react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { PermissionMatrix } from '@/components/admin/permission-matrix';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import admin from '@/routes/admin';
import type { Permission, RoleDetail } from '@/types';

export default function RolesEdit({
    role,
    permissions,
}: {
    role: RoleDetail;
    permissions: Permission[];
}) {
    const { data, setData, put, processing, errors } = useForm({
        name: role.name,
        permissions: role.permissions,
    });

    function submit(event: React.FormEvent) {
        event.preventDefault();
        put(admin.roles.update(role.id).url);
    }

    return (
        <>
            <Head title={`Edit ${role.name}`} />
            <div className="p-4 sm:p-6">
                <AdminPageHeader title={`Edit: ${role.name}`} />
                <form onSubmit={submit} className="max-w-4xl space-y-6">
                    <div className="grid max-w-sm gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={role.is_protected}
                            required
                        />
                        {role.is_protected && (
                            <p className="text-xs text-muted-foreground">
                                This is a system role that other parts of the
                                app depend on by name, so it can't be renamed or
                                deleted — its permissions can still be changed
                                below.
                            </p>
                        )}
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label>Permissions</Label>
                        <PermissionMatrix
                            permissions={permissions}
                            selected={data.permissions}
                            onChange={(names) => setData('permissions', names)}
                        />
                        <InputError message={errors.permissions} />
                    </div>

                    <Button type="submit" disabled={processing}>
                        {processing ? 'Saving...' : 'Save Changes'}
                    </Button>
                </form>
            </div>
        </>
    );
}

RolesEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Roles', href: admin.roles.index() },
    ],
};
