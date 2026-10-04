import { Head, useForm } from '@inertiajs/react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { PermissionMatrix } from '@/components/admin/permission-matrix';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import admin from '@/routes/admin';
import type { Permission } from '@/types';

export default function RolesCreate({
    permissions,
}: {
    permissions: Permission[];
}) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        permissions: [] as string[],
    });

    function submit(event: React.FormEvent) {
        event.preventDefault();
        post(admin.roles.store().url);
    }

    return (
        <>
            <Head title="New Role" />
            <div className="p-4 sm:p-6">
                <AdminPageHeader title="New Role" />
                <form onSubmit={submit} className="max-w-4xl space-y-6">
                    <div className="grid max-w-sm gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
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
                        {processing ? 'Creating...' : 'Create Role'}
                    </Button>
                </form>
            </div>
        </>
    );
}

RolesCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Roles', href: admin.roles.index() },
        { title: 'New', href: admin.roles.create() },
    ],
};
