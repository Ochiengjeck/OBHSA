import type { IntroSectionContent } from '@/types';

export function IntroSection({ content }: { content: IntroSectionContent }) {
    return (
        <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">
                {content.heading}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">{content.body}</p>
        </section>
    );
}
