import { cn, storageUrl } from '@/lib/utils';
import type { FeatureShowcaseSectionContent } from '@/types';

export function FeatureShowcaseSection({
    content,
}: {
    content: FeatureShowcaseSectionContent;
}) {
    if (content.items.length === 0) {
        return null;
    }

    return (
        <section className="py-16">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-semibold tracking-tight text-foreground">
                        {content.heading}
                    </h2>
                    {content.subheading && (
                        <p className="mt-4 text-muted-foreground">
                            {content.subheading}
                        </p>
                    )}
                </div>

                <div className="mt-16 space-y-16">
                    {content.items.map((item, index) => (
                        <div
                            key={index}
                            className="grid gap-10 lg:grid-cols-2 lg:items-center"
                        >
                            <div
                                className={cn(index % 2 === 1 && 'lg:order-2')}
                            >
                                {item.image_path ? (
                                    <img
                                        src={
                                            storageUrl(item.image_path) ??
                                            undefined
                                        }
                                        alt=""
                                        loading="lazy"
                                        className="aspect-4/3 w-full rounded-2xl object-cover shadow-lg"
                                    />
                                ) : (
                                    <div
                                        aria-hidden
                                        className="aspect-4/3 w-full rounded-2xl bg-gradient-to-br from-primary/20 to-accent/40"
                                    />
                                )}
                            </div>
                            <div
                                className={cn(index % 2 === 1 && 'lg:order-1')}
                            >
                                <h3 className="text-2xl font-semibold tracking-tight text-foreground">
                                    {item.title}
                                </h3>
                                <p className="mt-4 text-muted-foreground">
                                    {item.body}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
