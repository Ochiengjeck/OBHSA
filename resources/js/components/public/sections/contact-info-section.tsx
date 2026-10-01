import { usePage } from '@inertiajs/react';
import { Mail, MapPin, Phone } from 'lucide-react';
import type { ContactInfoSectionContent, SiteSettings } from '@/types';

export function ContactInfoSection({
    content,
}: {
    content: ContactInfoSectionContent;
}) {
    const { siteSettings } = usePage<{ siteSettings: SiteSettings }>().props;

    return (
        <section className="py-16">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-semibold tracking-tight text-foreground">
                    {content.heading}
                </h2>
                <p className="mt-2 text-muted-foreground">{content.body}</p>

                <dl className="mt-8 space-y-4">
                    {siteSettings.address && (
                        <div className="flex items-start gap-3">
                            <MapPin className="mt-0.5 size-5 shrink-0 text-primary" />
                            <dd className="text-sm text-foreground">
                                {siteSettings.address}
                            </dd>
                        </div>
                    )}
                    {siteSettings.phone && (
                        <div className="flex items-start gap-3">
                            <Phone className="mt-0.5 size-5 shrink-0 text-primary" />
                            <dd className="text-sm text-foreground">
                                <a
                                    href={`tel:${siteSettings.phone.replace(/[^\d+]/g, '')}`}
                                >
                                    {siteSettings.phone}
                                </a>
                            </dd>
                        </div>
                    )}
                    {siteSettings.email && (
                        <div className="flex items-start gap-3">
                            <Mail className="mt-0.5 size-5 shrink-0 text-primary" />
                            <dd className="text-sm text-foreground">
                                <a href={`mailto:${siteSettings.email}`}>
                                    {siteSettings.email}
                                </a>
                            </dd>
                        </div>
                    )}
                </dl>
            </div>
        </section>
    );
}
