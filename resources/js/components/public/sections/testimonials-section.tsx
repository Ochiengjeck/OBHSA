import { Card, CardContent } from '@/components/ui/card';
import { storageUrl } from '@/lib/utils';
import type { TestimonialsSectionContent, Testimonial } from '@/types';

export function TestimonialsSection({
    content,
    testimonials,
}: {
    content: TestimonialsSectionContent;
    testimonials: Testimonial[];
}) {
    if (testimonials.length === 0) {
        return null;
    }

    return (
        <section className="py-16">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <h2 className="text-center text-3xl font-semibold tracking-tight text-foreground">
                    {content.heading}
                </h2>

                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {testimonials.map((testimonial) => (
                        <Card key={testimonial.id} className="h-full">
                            <CardContent className="flex h-full flex-col justify-between">
                                <p className="text-sm text-foreground">
                                    &ldquo;{testimonial.quote}&rdquo;
                                </p>
                                <div className="mt-6 flex items-center gap-3">
                                    {testimonial.author_photo_path ? (
                                        <img
                                            src={
                                                storageUrl(
                                                    testimonial.author_photo_path,
                                                ) ?? undefined
                                            }
                                            alt=""
                                            loading="lazy"
                                            className="size-10 shrink-0 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div
                                            aria-hidden
                                            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary"
                                        >
                                            {testimonial.author_name.charAt(0)}
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">
                                            {testimonial.author_name}
                                        </p>
                                        {testimonial.author_role && (
                                            <p className="text-xs text-muted-foreground">
                                                {testimonial.author_role}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
