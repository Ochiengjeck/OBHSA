import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import type { HeroSectionContent } from '@/types';

export function HeroSection({ content }: { content: HeroSectionContent }) {
    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-accent/40 to-background">
            <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-28">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">
                        {content.heading}
                    </h1>
                    <p className="mt-6 max-w-xl text-lg text-muted-foreground">
                        {content.subheading}
                    </p>
                    <div className="mt-8 flex flex-wrap gap-4">
                        {content.primary_cta_label &&
                            content.primary_cta_url && (
                                <Button size="lg" asChild>
                                    <Link href={content.primary_cta_url}>
                                        {content.primary_cta_label}
                                    </Link>
                                </Button>
                            )}
                        {content.secondary_cta_label &&
                            content.secondary_cta_url && (
                                <Button size="lg" variant="outline" asChild>
                                    <Link href={content.secondary_cta_url}>
                                        {content.secondary_cta_label}
                                    </Link>
                                </Button>
                            )}
                    </div>
                </div>

                {content.image_path ? (
                    <img
                        src={content.image_path}
                        alt=""
                        className="aspect-4/3 w-full rounded-2xl object-cover shadow-lg"
                    />
                ) : (
                    <div
                        aria-hidden
                        className="aspect-4/3 w-full rounded-2xl bg-gradient-to-br from-primary/20 to-accent/40"
                    />
                )}
            </div>
        </section>
    );
}
