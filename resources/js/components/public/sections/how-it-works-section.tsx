import type { HowItWorksSectionContent } from '@/types';

export function HowItWorksSection({
    content,
}: {
    content: HowItWorksSectionContent;
}) {
    return (
        <section className="py-16">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <h2 className="text-center text-3xl font-semibold tracking-tight text-foreground">
                    {content.heading}
                </h2>

                <div className="mt-12 grid gap-8 sm:grid-cols-3">
                    {content.steps.map((step, index) => (
                        <div key={step.title} className="relative">
                            <div className="flex size-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                                {index + 1}
                            </div>
                            <h3 className="mt-4 text-lg font-semibold text-foreground">
                                {step.title}
                            </h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
