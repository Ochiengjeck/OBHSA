import { cn } from '@/lib/utils';

const STEPS = [
    'Contact',
    'Location',
    'Preferences',
    'Experience',
    'Education',
    'Documents',
    'Consent',
    'Review',
];

export function ApplyStepper({ current }: { current: number }) {
    return (
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-2 text-xs sm:text-sm">
            {STEPS.map((label, index) => {
                const step = index + 1;
                const isComplete = step < current;
                const isCurrent = step === current;

                return (
                    <li key={label} className="flex items-center gap-2">
                        <span
                            className={cn(
                                'flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold',
                                isCurrent &&
                                    'bg-primary text-primary-foreground',
                                isComplete && 'bg-primary/15 text-primary',
                                !isCurrent &&
                                    !isComplete &&
                                    'bg-muted text-muted-foreground',
                            )}
                        >
                            {step}
                        </span>
                        <span
                            className={cn(
                                'hidden sm:inline',
                                isCurrent
                                    ? 'font-medium text-foreground'
                                    : 'text-muted-foreground',
                            )}
                        >
                            {label}
                        </span>
                        {step !== STEPS.length && (
                            <span
                                className="mx-1 h-px w-3 bg-border sm:w-6"
                                aria-hidden
                            />
                        )}
                    </li>
                );
            })}
        </ol>
    );
}
