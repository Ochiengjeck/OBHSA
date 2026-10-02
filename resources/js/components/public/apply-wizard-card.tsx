import type { ReactNode } from 'react';
import { ApplyStepper } from '@/components/public/apply-stepper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ApplyWizardCard({
    step,
    title,
    description,
    children,
}: {
    step: number;
    title: string;
    description?: string;
    children: ReactNode;
}) {
    return (
        <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="mb-8">
                <ApplyStepper current={step} />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">{title}</CardTitle>
                    {description && (
                        <p className="text-sm text-muted-foreground">
                            {description}
                        </p>
                    )}
                </CardHeader>
                <CardContent>{children}</CardContent>
            </Card>
        </section>
    );
}
