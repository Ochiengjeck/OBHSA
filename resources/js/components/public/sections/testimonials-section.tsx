import { Card, CardContent } from '@/components/ui/card';
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
                                <div className="mt-6">
                                    <p className="text-sm font-semibold text-foreground">
                                        {testimonial.author_name}
                                    </p>
                                    {testimonial.author_role && (
                                        <p className="text-xs text-muted-foreground">
                                            {testimonial.author_role}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
