import { PageHead } from '@/components/public/page-head';
import { SectionRenderer } from '@/components/public/section-renderer';
import { ServiceCard } from '@/components/public/service-card';
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
                        <ServiceCard key={service.id} service={service} />
                    ))}
                </div>
            </section>
        </>
    );
}
