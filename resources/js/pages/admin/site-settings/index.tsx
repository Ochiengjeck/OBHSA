import { Head, useForm } from '@inertiajs/react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/components/input-error';
import admin from '@/routes/admin';
import type { SiteSettingRecord } from '@/types';

const GROUPS: { key: SiteSettingRecord['group']; label: string }[] = [
    { key: 'general', label: 'General' },
    { key: 'contact', label: 'Contact' },
    { key: 'social', label: 'Social' },
    { key: 'branding', label: 'Branding' },
];

const LABELS: Record<string, string> = {
    business_name: 'Business Name',
    business_short_name: 'Short Name',
    tagline: 'Tagline',
    footer_note: 'Footer Note',
    address: 'Address',
    phone: 'Phone',
    email: 'Email',
    logo_path: 'Logo',
    facebook_url: 'Facebook URL',
    linkedin_url: 'LinkedIn URL',
    twitter_url: 'Twitter URL',
    instagram_url: 'Instagram URL',
    service_area_states: 'States We Serve (comma-separated, e.g. "NH, MA")',
};

export default function SiteSettingsIndex({
    settings,
}: {
    settings: SiteSettingRecord[];
}) {
    const initialValues = Object.fromEntries(
        settings
            .filter((setting) => setting.type !== 'image')
            .map((setting) => [setting.key, setting.value ?? '']),
    );

    const { data, setData, put, processing, errors } = useForm({
        settings: initialValues,
        logo: null as File | null,
    });

    function submit(event: React.FormEvent) {
        event.preventDefault();
        put(admin.siteSettings.update().url, { forceFormData: true });
    }

    function fieldFor(setting: SiteSettingRecord) {
        const label = LABELS[setting.key] ?? setting.key;

        if (setting.type === 'image') {
            return (
                <div key={setting.key} className="grid gap-2">
                    <Label htmlFor={setting.key}>{label}</Label>
                    {setting.value && (
                        <img
                            src={setting.value}
                            alt=""
                            className="h-12 w-auto rounded border border-border object-contain p-1"
                        />
                    )}
                    <Input
                        id={setting.key}
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                            setData('logo', e.target.files?.[0] ?? null)
                        }
                    />
                    <InputError message={errors.logo} />
                </div>
            );
        }

        if (setting.type === 'textarea') {
            return (
                <div key={setting.key} className="grid gap-2">
                    <Label htmlFor={setting.key}>{label}</Label>
                    <Textarea
                        id={setting.key}
                        rows={3}
                        value={data.settings[setting.key] ?? ''}
                        onChange={(e) =>
                            setData('settings', {
                                ...data.settings,
                                [setting.key]: e.target.value,
                            })
                        }
                    />
                </div>
            );
        }

        return (
            <div key={setting.key} className="grid gap-2">
                <Label htmlFor={setting.key}>{label}</Label>
                <Input
                    id={setting.key}
                    type={
                        setting.type === 'email'
                            ? 'email'
                            : setting.type === 'url'
                              ? 'url'
                              : 'text'
                    }
                    value={data.settings[setting.key] ?? ''}
                    onChange={(e) =>
                        setData('settings', {
                            ...data.settings,
                            [setting.key]: e.target.value,
                        })
                    }
                />
            </div>
        );
    }

    return (
        <>
            <Head title="Site Settings" />
            <div className="p-4 sm:p-6">
                <AdminPageHeader
                    title="Site Settings"
                    description="Business identity, contact details, branding, and social links shown across the site."
                />

                <form onSubmit={submit} className="max-w-2xl space-y-8">
                    <Tabs defaultValue="general">
                        <TabsList>
                            {GROUPS.map((group) => (
                                <TabsTrigger key={group.key} value={group.key}>
                                    {group.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {GROUPS.map((group) => (
                            <TabsContent
                                key={group.key}
                                value={group.key}
                                className="space-y-5 pt-4"
                            >
                                {settings
                                    .filter((s) => s.group === group.key)
                                    .map(fieldFor)}
                            </TabsContent>
                        ))}
                    </Tabs>

                    <Button type="submit" disabled={processing}>
                        {processing ? 'Saving...' : 'Save Settings'}
                    </Button>
                </form>
            </div>
        </>
    );
}

SiteSettingsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Site Settings', href: admin.siteSettings.index() },
    ],
};
