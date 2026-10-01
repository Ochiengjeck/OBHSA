import { PageHead } from '@/components/public/page-head';
import { SectionRenderer } from '@/components/public/section-renderer';
import { StaffingRequestForm } from '@/components/public/staffing-request-form';
import type { Page, PageSection } from '@/types';

export default function Contact({
    page,
    sections,
}: {
    page: Page;
    sections: PageSection[];
}) {
    return (
        <>
            <PageHead title={page.title} description={page.meta_description} />
            <SectionRenderer sections={sections} />
            <section className="px-4 pb-20 sm:px-6 lg:px-8">
                <StaffingRequestForm />
            </section>
        </>
    );
}
