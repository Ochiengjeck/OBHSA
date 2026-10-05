import { Head, useForm } from '@inertiajs/react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { PermissionMatrix } from '@/components/admin/permission-matrix';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import admin from '@/routes/admin';
import type { Permission } from '@/types';

const PROVIDERS = [
    { value: 'default', label: 'Use .env default' },
    { value: 'claude', label: 'Claude (Anthropic)' },
    { value: 'gemini', label: 'Gemini (Google)' },
    { value: 'xai', label: 'Grok (xAI)' },
] as const;

const KEY_FIELDS: {
    provider: 'claude' | 'gemini' | 'xai';
    label: string;
    field: 'claude_api_key' | 'gemini_api_key' | 'xai_api_key';
}[] = [
    { provider: 'claude', label: 'Claude API key', field: 'claude_api_key' },
    { provider: 'gemini', label: 'Gemini API key', field: 'gemini_api_key' },
    { provider: 'xai', label: 'xAI API key', field: 'xai_api_key' },
];

export default function AiSettingsIndex({
    provider,
    keyOverrides,
    permissions,
    grantedPermissions,
}: {
    provider: string | null;
    keyOverrides: Record<'claude' | 'gemini' | 'xai', boolean>;
    permissions: Permission[];
    grantedPermissions: string[];
}) {
    const { data, setData, put, processing, errors, transform } = useForm({
        provider: provider ?? 'default',
        claude_api_key: '',
        gemini_api_key: '',
        xai_api_key: '',
        permissions: grantedPermissions,
    });

    transform((formData) => ({
        ...formData,
        provider: formData.provider === 'default' ? null : formData.provider,
    }));

    function submit(event: React.FormEvent) {
        event.preventDefault();
        put(admin.aiSettings.update().url);
    }

    return (
        <>
            <Head title="AI Settings" />
            <div className="p-4 sm:p-6">
                <AdminPageHeader
                    title="AI Settings"
                    description="Choose which AI provider the copilot uses, override its API keys, and grant it the permissions it's allowed to act on."
                />

                <form onSubmit={submit} className="max-w-3xl space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Provider</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid max-w-sm gap-2">
                                <Label htmlFor="provider">Active agent</Label>
                                <Select
                                    value={data.provider}
                                    onValueChange={(value) =>
                                        setData('provider', value)
                                    }
                                >
                                    <SelectTrigger
                                        id="provider"
                                        className="w-full"
                                    >
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PROVIDERS.map((option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                {KEY_FIELDS.map(
                                    ({
                                        provider: providerKey,
                                        label,
                                        field,
                                    }) => (
                                        <div
                                            key={field}
                                            className="grid max-w-sm gap-2"
                                        >
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor={field}>
                                                    {label}
                                                </Label>
                                                <Badge
                                                    variant={
                                                        keyOverrides[
                                                            providerKey
                                                        ]
                                                            ? 'default'
                                                            : 'secondary'
                                                    }
                                                >
                                                    {keyOverrides[providerKey]
                                                        ? 'Custom key set'
                                                        : 'Using .env'}
                                                </Badge>
                                            </div>
                                            <Input
                                                id={field}
                                                type="password"
                                                autoComplete="off"
                                                placeholder={
                                                    keyOverrides[providerKey]
                                                        ? 'Leave blank to keep, or clear to revert to .env'
                                                        : 'Leave blank to keep using .env'
                                                }
                                                value={data[field]}
                                                onChange={(e) =>
                                                    setData(
                                                        field,
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            {errors[field] && (
                                                <p className="text-sm text-destructive">
                                                    {errors[field]}
                                                </p>
                                            )}
                                        </div>
                                    ),
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>What the copilot can do</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                These are the permissions the AI itself holds —
                                separate from who can edit this page. The AI can
                                never do more than the person talking to it
                                could already do by hand, so a permission only
                                takes effect when both it and the acting user
                                have it. If nothing is checked here, the AI is
                                unrestricted (the default before this page has
                                ever been saved); checking any permission
                                switches it to exactly that set.
                            </p>
                            <PermissionMatrix
                                permissions={permissions}
                                selected={data.permissions}
                                onChange={(names) =>
                                    setData('permissions', names)
                                }
                            />
                            {errors.permissions && (
                                <p className="text-sm text-destructive">
                                    {errors.permissions}
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    <Button type="submit" disabled={processing}>
                        {processing ? 'Saving...' : 'Save Changes'}
                    </Button>
                </form>
            </div>
        </>
    );
}

AiSettingsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'AI Settings', href: admin.aiSettings.index() },
    ],
};
