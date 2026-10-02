import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export type OnboardingChecklistTemplateItemFormData = {
    task_key: string;
    label: string;
    is_blocking: boolean;
    position: number;
};

export function OnboardingChecklistTemplateItemForm({
    data,
    setData,
    errors,
    processing,
    submitLabel,
}: {
    data: OnboardingChecklistTemplateItemFormData;
    setData: <K extends keyof OnboardingChecklistTemplateItemFormData>(
        key: K,
        value: OnboardingChecklistTemplateItemFormData[K],
    ) => void;
    errors: Partial<
        Record<keyof OnboardingChecklistTemplateItemFormData, string>
    >;
    processing: boolean;
    submitLabel: string;
}) {
    return (
        <div className="max-w-xl space-y-5">
            <div className="grid gap-2">
                <Label htmlFor="label">Label</Label>
                <Input
                    id="label"
                    placeholder="I-9 Verification"
                    value={data.label}
                    onChange={(e) => setData('label', e.target.value)}
                    required
                />
                <InputError message={errors.label} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="task_key">
                    Task Key (used internally, letters/numbers/dashes only)
                </Label>
                <Input
                    id="task_key"
                    placeholder="i9_verification"
                    value={data.task_key}
                    onChange={(e) => setData('task_key', e.target.value)}
                    required
                />
                <InputError message={errors.task_key} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="position">Position</Label>
                <Input
                    id="position"
                    type="number"
                    min={0}
                    value={data.position}
                    onChange={(e) =>
                        setData('position', Number(e.target.value))
                    }
                />
                <InputError message={errors.position} />
            </div>

            <div className="flex items-center gap-2">
                <Switch
                    id="is_blocking"
                    checked={data.is_blocking}
                    onCheckedChange={(checked) =>
                        setData('is_blocking', checked)
                    }
                />
                <Label htmlFor="is_blocking">
                    Blocking (must pass before the application can activate)
                </Label>
            </div>

            <Button type="submit" disabled={processing}>
                {processing ? 'Saving...' : submitLabel}
            </Button>
        </div>
    );
}
