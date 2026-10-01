import { Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { getLucideIcon } from '@/lib/dynamic-icon';
import { show } from '@/routes/services';
import type { ServicesListSectionContent, Service } from '@/types';

export function ServicesListSection({
    content,
    services,
}: {
    content: ServicesListSectionContent;
    services: Service[];
}) {
    if (services.length === 0) {
        return null;
    }

    return (
        <section className="bg-muted/30 py-16">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-semibold tracking-tight text-foreground">
                        {content.heading}
                    </h2>
                    <p className="mt-4 text-muted-foreground">
                        {content.subheading}
                    </p>
                </div>

                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
            </div>
        </section>
    );
}
