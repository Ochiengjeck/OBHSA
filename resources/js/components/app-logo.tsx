import { usePage } from '@inertiajs/react';

import AppLogoIcon from '@/components/app-logo-icon';
import { useStorageUrl } from '@/hooks/use-storage-url';
import type { SiteSettings } from '@/types';

export default function AppLogo() {
    const { name, siteSettings } = usePage<{
        siteSettings: SiteSettings;
    }>().props;
    const storageUrl = useStorageUrl();
    const logoUrl = storageUrl(siteSettings?.logo_path);

    return (
        <>
            {logoUrl ? (
                <img
                    src={logoUrl}
                    alt={name}
                    className="size-8 shrink-0 rounded-md object-contain"
                />
            ) : (
                <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                    <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
                </div>
            )}
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    {name}
                </span>
            </div>
        </>
    );
}
