import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

export type OnboardingChecklistTemplateFormData = {
    name: string;
    description: string;
    is_default: boolean;
    is_active: boolean;
};

export function OnboardingChecklistTemplateForm({
    data,
    setData,
    errors,
    processing,
    submitLabel,
}: {
    data: OnboardingChecklistTemplateFormData;
    setData: <K extends keyof OnboardingChecklistTemplateFormData>(
        key: K,
        value: OnboardingChecklistTemplateFormData[K],
    ) => void;
    errors: Partial<Record<keyof OnboardingChecklistTemplateFormData, string>>;
    processing: boolean;
    submitLabel: string;
}) {
    return (
        <div className="max-w-xl space-y-5">
            <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    placeholder="Standard RN Onboarding"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    required
                />
                <InputError message={errors.name} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                    id="description"
                    rows={3}
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                />
                <InputError message={errors.description} />
            </div>

            <div className="flex items-center gap-2">
                <Switch
                    id="is_default"
                    checked={data.is_default}
                    onCheckedChange={(checked) =>
                        setData('is_default', checked)
                    }
                />
                <Label htmlFor="is_default">
                    Default (instantiated for every application that enters
                    onboarding)
                </Label>
            </div>

            <div className="flex items-center gap-2">
                <Switch
                    id="is_active"
                    checked={data.is_active}
                    onCheckedChange={(checked) => setData('is_active', checked)}
                />
                <Label htmlFor="is_active">Active</Label>
            </div>

            <Button type="submit" disabled={processing}>
                {processing ? 'Saving...' : submitLabel}
            </Button>
        </div>
    );
}
