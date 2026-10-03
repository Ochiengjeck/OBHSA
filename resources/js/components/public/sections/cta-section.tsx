import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { useStorageUrl } from '@/hooks/use-storage-url';
import type { CtaSectionContent } from '@/types';

export function CtaSection({ content }: { content: CtaSectionContent }) {
    const storageUrl = useStorageUrl();

    return (
        <section className="relative overflow-hidden bg-primary py-16">
            {content.image_path && (
                <>
                    <img
                        src={storageUrl(content.image_path) ?? undefined}
                        alt=""
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div
                        aria-hidden
                        className="absolute inset-0 bg-primary/80"
                    />
                </>
            )}
            <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
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
