import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import { ApplyStepper } from '@/components/public/apply-stepper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    APPLY_STEPS,
    applyStepIndex,
    type ApplyStepKey,
} from '@/lib/apply-steps';

export function ApplyWizardCard({
    stepKey,
    title,
    description,
    children,
}: {
    stepKey: ApplyStepKey;
    title: string;
    description?: string;
    children: ReactNode;
}) {
    const currentIndex = applyStepIndex(stepKey);
    const previousStep =
        currentIndex > 0 ? APPLY_STEPS[currentIndex - 1] : null;

    return (
        <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="mb-8">
                <ApplyStepper current={stepKey} />
            </div>

            {previousStep && (
                <Link
                    href={previousStep.href}
                    className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ArrowLeft className="size-4" />
                    Back to {previousStep.label}
                </Link>
            )}

            <Card>
                <CardHeader>
                    <p className="text-xs font-medium tracking-wide text-primary uppercase">
                        Step {currentIndex + 1} of {APPLY_STEPS.length}
                    </p>
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
