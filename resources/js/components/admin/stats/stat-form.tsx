import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import InputError from '@/components/input-error';
import { ICON_NAMES } from '@/lib/dynamic-icon';

export type StatFormData = {
    label: string;
    value: string;
    icon: string;
    position: number;
    is_active: boolean;
};

export function StatForm({
    data,
    setData,
    errors,
    processing,
    submitLabel,
}: {
    data: StatFormData;
    setData: <K extends keyof StatFormData>(
        key: K,
        value: StatFormData[K],
    ) => void;
    errors: Partial<Record<keyof StatFormData, string>>;
    processing: boolean;
    submitLabel: string;
}) {
    return (
        <div className="max-w-xl space-y-5">
            <div className="grid gap-2">
                <Label htmlFor="label">Label</Label>
                <Input
                    id="label"
                    placeholder="Caregivers Placed"
                    value={data.label}
                    onChange={(e) => setData('label', e.target.value)}
                    required
                />
                <InputError message={errors.label} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="value">Value</Label>
                <Input
                    id="value"
                    placeholder="1,200+"
                    value={data.value}
                    onChange={(e) => setData('value', e.target.value)}
                    required
                />
                <InputError message={errors.value} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="icon">Icon</Label>
                <Select
                    value={data.icon || 'none'}
                    onValueChange={(v) =>
                        setData('icon', v === 'none' ? '' : v)
                    }
                >
                    <SelectTrigger id="icon">
                        <SelectValue placeholder="No icon" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="none">No icon</SelectItem>
                        {ICON_NAMES.map((name) => (
                            <SelectItem key={name} value={name}>
                                {name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <InputError message={errors.icon} />
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
