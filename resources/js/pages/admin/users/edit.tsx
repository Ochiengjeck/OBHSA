import { Head, router, useForm, usePage } from '@inertiajs/react';
import { KeyRound, Mail, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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
import type { Role, StaffUser } from '@/types';

export default function UsersEdit({
    user,
    roles,
}: {
    user: StaffUser;
    roles: Role[];
}) {
    const { flash } = usePage<{
        flash?: { generatedPassword?: string };
    }>().props;

    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        role: user.roles[0]?.name ?? roles[0]?.name ?? '',
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
                        <AlertTitle>New password</AlertTitle>
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

                <div className="max-w-xl space-y-6">
                    <form onSubmit={submit} className="space-y-5">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
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
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
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
                            {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </form>

                    <PasswordCard user={user} />
                </div>
            </div>
        </>
    );
}

function PasswordCard({ user }: { user: StaffUser }) {
    const [showManualForm, setShowManualForm] = useState(false);
    const {
        data,
        setData,
        put,
        processing: settingPassword,
        errors,
        reset,
    } = useForm({
        password: '',
        password_confirmation: '',
    });

    function generate() {
        router.post(
            admin.users.generatePassword(user.id).url,
            {},
            { preserveScroll: true },
        );
    }

    function setPassword(event: React.FormEvent) {
        event.preventDefault();
        put(admin.users.setPassword(user.id).url, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setShowManualForm(false);
            },
        });
    }

    function sendResetLink() {
        router.post(
            admin.users.sendResetLink(user.id).url,
            {},
            { preserveScroll: true },
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                    Generate a new password, set a specific one, or email{' '}
                    {user.name} a reset link.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-3">
                    <Button type="button" variant="outline" onClick={generate}>
                        <RefreshCw className="size-4" />
                        Generate New Password
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={sendResetLink}
                    >
                        <Mail className="size-4" />
                        Send Password Reset Email
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setShowManualForm((v) => !v)}
                    >
                        {showManualForm
                            ? 'Cancel'
                            : 'Set a specific password...'}
                    </Button>
                </div>

                {showManualForm && (
                    <form
                        onSubmit={setPassword}
                        className="max-w-sm space-y-4 border-t border-border pt-4"
                    >
                        <div className="grid gap-2">
                            <Label htmlFor="password">New password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                required
                            />
                            <InputError message={errors.password} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">
                                Confirm password
                            </Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    setData(
                                        'password_confirmation',
                                        e.target.value,
                                    )
                                }
                                required
                            />
                        </div>
                        <Button type="submit" disabled={settingPassword}>
                            {settingPassword ? 'Saving...' : 'Set Password'}
                        </Button>
                    </form>
                )}
            </CardContent>
        </Card>
    );
}

UsersEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Users', href: admin.users.index() },
    ],
};
