import { Link } from '@inertiajs/react';
import { Check } from 'lucide-react';
import {
    APPLY_STEPS,
    applyStepIndex,
    type ApplyStepKey,
} from '@/lib/apply-steps';
import { cn } from '@/lib/utils';

export function ApplyStepper({ current }: { current: ApplyStepKey }) {
    const currentIndex = applyStepIndex(current);
    const total = APPLY_STEPS.length;
    const percent = Math.round(((currentIndex + 1) / total) * 100);

    return (
        <div>
            {/* Compact mobile view: a label + fill-bar reads cleanly at
                narrow widths where a full step row would cramp or wrap. */}
            <div className="sm:hidden">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                        Step {currentIndex + 1} of {total}
                    </span>
                    <span className="font-medium text-foreground">
                        {APPLY_STEPS[currentIndex].label}
                    </span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                        className="h-full rounded-full bg-primary transition-all duration-300"
                        style={{ width: `${percent}%` }}
                    />
                </div>
            </div>

            {/* Full view: connected step row, completed steps link back. */}
            <ol className="hidden items-center sm:flex">
                {APPLY_STEPS.map((step, index) => {
                    const isComplete = index < currentIndex;
                    const isCurrent = index === currentIndex;
                    const circle = (
                        <span
                            className={cn(
                                'flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors',
                                isCurrent &&
                                    'bg-primary text-primary-foreground ring-4 ring-primary/15',
                                isComplete &&
                                    'bg-primary text-primary-foreground',
                                !isCurrent &&
                                    !isComplete &&
                                    'bg-muted text-muted-foreground',
                            )}
                        >
                            {isComplete ? (
                                <Check className="size-4" />
                            ) : (
                                index + 1
                            )}
                        </span>
                    );

                    return (
                        <li
                            key={step.key}
                            className={cn(index !== total - 1 && 'flex-1')}
                        >
                            {/* Circle + connecting line share one row so the
                                line always aligns with the circle's center,
                                regardless of whether the label below renders. */}
                            <div className="flex items-center">
                                {isComplete ? (
                                    <Link
                                        href={step.href}
                                        aria-label={`Back to ${step.label}`}
                                    >
                                        {circle}
                                    </Link>
                                ) : (
                                    circle
                                )}
                                {index !== total - 1 && (
                                    <span
                                        aria-hidden
                                        className={cn(
                                            'mx-2 h-px flex-1',
                                            isComplete
                                                ? 'bg-primary'
                                                : 'bg-border',
                                        )}
                                    />
                                )}
                            </div>
                            <span
                                className={cn(
                                    'mt-1.5 hidden text-[11px] font-medium whitespace-nowrap lg:block',
                                    isCurrent
                                        ? 'text-foreground'
                                        : 'text-muted-foreground',
                                )}
                            >
                                {step.label}
                            </span>
                        </li>
                    );
                })}
            </ol>
        </div>
    );
}
