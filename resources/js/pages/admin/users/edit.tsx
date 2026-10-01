import { Head, useForm, usePage } from '@inertiajs/react';
import { KeyRound } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
import type { StaffUser } from '@/types';

export default function UsersEdit({ user }: { user: StaffUser }) {
    const { flash } = usePage<{
        flash?: { generatedPassword?: string };
    }>().props;

    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        role: user.roles[0]?.name ?? 'editor',
    });

    function submit(event: React.FormEvent) {
        event.preventDefault();
        put(admin.users.update(user.id).url);
    }

    return (
        <>
            <Head title={`Edit ${user.name}`} />
            <div className="p-4 sm:p-6">
                <AdminPageHeader title={`Edit: ${user.name}`} />

                {flash?.generatedPassword && (
                    <Alert className="mb-6 max-w-xl">
                        <KeyRound className="size-4" />
                        <AlertTitle>Initial password</AlertTitle>
                        <AlertDescription>
                            <p>
                                Share this password with {user.name} now — it
                                won't be shown again:
                            </p>
                            <p className="mt-2 rounded bg-muted px-2 py-1 font-mono text-sm">
                                {flash.generatedPassword}
                            </p>
                        </AlertDescription>
                    </Alert>
                )}

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
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="editor">Editor</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.role} />
                    </div>

                    <Button type="submit" disabled={processing}>
                        {processing ? 'Saving...' : 'Save Changes'}
                    </Button>
                </form>
            </div>
        </>
    );
}

UsersEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Users', href: admin.users.index() },
    ],
};
