import { useStorageUrl } from '@/hooks/use-storage-url';
import type { GallerySectionContent } from '@/types';

export function GallerySection({
    content,
}: {
    content: GallerySectionContent;
}) {
    const storageUrl = useStorageUrl();

    if (content.images.length === 0) {
        return null;
    }

    return (
        <section className="py-16">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                {content.heading && (
                    <h2 className="text-center text-3xl font-semibold tracking-tight text-foreground">
                        {content.heading}
                    </h2>
                )}

                <div
                    className={
                        content.heading
                            ? 'mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4'
                            : 'grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4'
                    }
                >
                    {content.images.map((image, index) => (
                        <div
                            key={index}
                            className="group relative aspect-square overflow-hidden rounded-xl"
                        >
                            {image.image_path ? (
                                <img
                                    src={
                                        storageUrl(image.image_path) ??
                                        undefined
                                    }
                                    alt={image.caption ?? ''}
                                    loading="lazy"
                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            ) : (
                                <div
                                    aria-hidden
                                    className="h-full w-full bg-gradient-to-br from-primary/15 to-accent/30"
                                />
                            )}
                            {image.caption && (
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                                    <p className="text-xs text-white">
                                        {image.caption}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
