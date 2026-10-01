import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import type { FaqSectionContent } from '@/types';

export function FaqSection({ content }: { content: FaqSectionContent }) {
    return (
        <section className="py-16">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                <h2 className="text-center text-3xl font-semibold tracking-tight text-foreground">
                    {content.heading}
                </h2>

                <Accordion type="single" collapsible className="mt-10">
                    {content.items.map((item, index) => (
                        <AccordionItem
                            key={item.question}
                            value={`item-${index}`}
                        >
                            <AccordionTrigger className="text-left">
                                {item.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                                {item.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}
