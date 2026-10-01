import { PageHead } from '@/components/public/page-head';
import { SectionRenderer } from '@/components/public/section-renderer';
import type { Page, PageSection, Service, Stat, Testimonial } from '@/types';

export function CmsPage({
    page,
    sections,
    services,
    testimonials,
    stats,
}: {
    page: Page;
    sections: PageSection[];
    services: Service[];
    testimonials: Testimonial[];
    stats: Stat[];
}) {
    return (
        <>
            <PageHead title={page.title} description={page.meta_description} />
            <SectionRenderer
                sections={sections}
                services={services}
                testimonials={testimonials}
                stats={stats}
            />
        </>
    );
}
