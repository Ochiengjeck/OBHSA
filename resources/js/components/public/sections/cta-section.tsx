import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import type { CtaSectionContent } from '@/types';

export function CtaSection({ content }: { content: CtaSectionContent }) {
    return (
        <section className="bg-primary py-16">
            <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
                <h2 className="text-3xl font-semibold tracking-tight text-primary-foreground">
                    {content.heading}
                </h2>
                <p className="mt-4 text-primary-foreground/90">
                    {content.body}
                </p>
                <Button size="lg" variant="secondary" asChild className="mt-8">
                    <Link href={content.button_url}>
                        {content.button_label}
                    </Link>
                </Button>
            </div>
        </section>
    );
}
