import { Head, useForm } from '@inertiajs/react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import InputError from '@/components/input-error';
import admin from '@/routes/admin';
import type { Role } from '@/types';

export default function UsersCreate({ roles }: { roles: Role[] }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        role:
            roles.find((r) => r.name === 'editor')?.name ??
            roles[0]?.name ??
            '',
    });

    function submit(event: React.FormEvent) {
        event.preventDefault();
        post(admin.users.store().url);
    }

    return (
        <>
            <Head title="New User" />
            <div className="p-4 sm:p-6">
                <AdminPageHeader
                    title="New User"
                    description="A random initial password will be generated and shown once after creation."
                />
                <form onSubmit={submit} className="max-w-xl space-y-5">
                    <div className="grid gap-2">
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
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="role">Role</Label>
                        <Select
                            value={data.role}
                            onValueChange={(v) => setData('role', v)}
                        >
                            <SelectTrigger id="role">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.map((r) => (
                                    <SelectItem
                                        key={r.id}
                                        value={r.name}
                                        className="capitalize"
                                    >
                                        {r.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.role} />
                    </div>

                    <Button type="submit" disabled={processing}>
                        {processing ? 'Creating...' : 'Create User'}
                    </Button>
                </form>
            </div>
        </>
    );
}

UsersCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Users', href: admin.users.index() },
        { title: 'New', href: admin.users.create() },
    ],
};
