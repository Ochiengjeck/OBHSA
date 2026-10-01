import { CtaSection } from '@/components/public/sections/cta-section';
import { FaqSection } from '@/components/public/sections/faq-section';
import { HeroSection } from '@/components/public/sections/hero-section';
import { HowItWorksSection } from '@/components/public/sections/how-it-works-section';
import { IntroSection } from '@/components/public/sections/intro-section';
import { ServicesListSection } from '@/components/public/sections/services-list-section';
import { StatsSection } from '@/components/public/sections/stats-section';
import { TestimonialsSection } from '@/components/public/sections/testimonials-section';
import { ContactInfoSection } from '@/components/public/sections/contact-info-section';
import type {
    CtaSectionContent,
    FaqSectionContent,
    HeroSectionContent,
    HowItWorksSectionContent,
    IntroSectionContent,
    PageSection,
    Service,
    ServicesListSectionContent,
    Stat,
    StatsSectionContent,
    Testimonial,
    TestimonialsSectionContent,
    ContactInfoSectionContent,
} from '@/types';

export function SectionRenderer({
    sections,
    services = [],
    testimonials = [],
    stats = [],
}: {
    sections: PageSection[];
    services?: Service[];
    testimonials?: Testimonial[];
    stats?: Stat[];
}) {
    return (
        <>
            {sections.map((section) => {
                switch (section.type) {
                    case 'hero':
                        return (
                            <HeroSection
                                key={section.id}
                                content={section.content as HeroSectionContent}
                            />
                        );
                    case 'intro':
                        return (
                            <IntroSection
                                key={section.id}
                                content={section.content as IntroSectionContent}
                            />
                        );
                    case 'services_list':
                        return (
                            <ServicesListSection
                                key={section.id}
                                content={
                                    section.content as ServicesListSectionContent
                                }
                                services={services}
                            />
                        );
                    case 'how_it_works':
                        return (
                            <HowItWorksSection
                                key={section.id}
                                content={
                                    section.content as HowItWorksSectionContent
                                }
                            />
                        );
                    case 'faq':
                        return (
                            <FaqSection
                                key={section.id}
                                content={section.content as FaqSectionContent}
                            />
                        );
                    case 'cta':
                        return (
                            <CtaSection
                                key={section.id}
                                content={section.content as CtaSectionContent}
                            />
                        );
                    case 'testimonials':
                        return (
                            <TestimonialsSection
                                key={section.id}
                                content={
                                    section.content as TestimonialsSectionContent
                                }
                                testimonials={testimonials}
                            />
                        );
                    case 'stats':
                        return (
                            <StatsSection
                                key={section.id}
                                content={section.content as StatsSectionContent}
                                stats={stats}
                            />
                        );
                    case 'contact_info':
                        return (
                            <ContactInfoSection
                                key={section.id}
                                content={
                                    section.content as ContactInfoSectionContent
                                }
                            />
                        );
                    default:
                        return null;
                }
            })}
        </>
    );
}
