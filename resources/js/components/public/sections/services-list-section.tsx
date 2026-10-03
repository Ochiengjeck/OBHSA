import { ServiceCard } from '@/components/public/service-card';
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
                        <ServiceCard key={service.id} service={service} />
                    ))}
                </div>
            </div>
        </section>
    );
}
