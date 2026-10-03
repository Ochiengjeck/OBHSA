import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { useStorageUrl } from '@/hooks/use-storage-url';
import type { HeroSectionContent } from '@/types';

export function HeroSection({ content }: { content: HeroSectionContent }) {
    const storageUrl = useStorageUrl();

    return (
        <section className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden">
            {content.image_path ? (
                <img
                    src={storageUrl(content.image_path) ?? undefined}
                    alt=""
                    loading="eager"
                    className="absolute inset-0 h-full w-full object-cover"
                />
            ) : (
                <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-accent/70"
                />
            )}
            {/* Brand wash: ties photos of varying brightness/color temperature
                into one consistent look. Multiply blend darkens proportionally
                to what's underneath, so it never flattens the photo. */}
            <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-br from-primary/75 via-primary/30 to-primary/55 mix-blend-multiply"
            />
            {/* Readability scrim: a fixed (theme-independent) dark pool
                centered on the headline, fading toward the edges. Guarantees
                contrast for the white text regardless of photo or theme. */}
            <div
                aria-hidden
                className="absolute inset-0 bg-[radial-gradient(ellipse_65%_60%_at_50%_50%,rgba(6,10,18,0.88)_0%,rgba(6,10,18,0.6)_40%,rgba(6,10,18,0.22)_70%,rgba(6,10,18,0.32)_100%)]"
            />

            <div className="relative mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold tracking-tight text-balance text-white sm:text-5xl lg:text-6xl">
                    {content.heading}
                </h1>
                <p className="mt-6 text-lg text-white/90 sm:text-xl">
                    {content.subheading}
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                    {content.primary_cta_label && content.primary_cta_url && (
                        <Button size="lg" asChild>
                            <Link href={content.primary_cta_url}>
                                {content.primary_cta_label}
                            </Link>
                        </Button>
                    )}
                    {content.secondary_cta_label &&
                        content.secondary_cta_url && (
                            <Button
                                size="lg"
                                variant="outline"
                                asChild
                                className="border-white/60 bg-transparent text-white hover:bg-white/10 hover:text-white"
                            >
                                <Link href={content.secondary_cta_url}>
                                    {content.secondary_cta_label}
                                </Link>
                            </Button>
                        )}
                </div>
            </div>
        </section>
    );
}
