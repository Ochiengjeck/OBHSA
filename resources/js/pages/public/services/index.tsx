import { Link } from '@inertiajs/react';
import { PageHead } from '@/components/public/page-head';
import { SectionRenderer } from '@/components/public/section-renderer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { getLucideIcon } from '@/lib/dynamic-icon';
import { show } from '@/routes/services';
import type { Page, PageSection, Service } from '@/types';

export default function ServicesIndex({
    page,
    sections,
    services,
}: {
    page: Page | null;
    sections: PageSection[];
    services: Service[];
}) {
    return (
        <>
            <PageHead
                title={page?.title ?? 'Our Services'}
                description={page?.meta_description}
            />
            <SectionRenderer sections={sections} />

            <section className="py-16">
                <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8">
                    {services.map((service) => (
                        <Link key={service.id} href={show(service.slug)}>
                            <Card className="h-full transition-shadow hover:shadow-md">
                                <CardHeader>
                                    <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <Icon
                                            iconNode={getLucideIcon(
                                                service.icon,
                                            )}
                                            className="size-6"
                                        />
                                    </div>
                                    <CardTitle className="mt-4">
                                        {service.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        {service.summary}
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </section>
        </>
    );
}
