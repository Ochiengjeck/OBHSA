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
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/components/input-error';
import { ICON_NAMES } from '@/lib/dynamic-icon';

export type ServiceFormData = {
    title: string;
    summary: string;
    description: string;
    icon: string;
    image: File | null;
    position: number;
    is_active: boolean;
};

export function ServiceForm({
    data,
    setData,
    errors,
    processing,
    imagePreview,
    submitLabel,
}: {
    data: ServiceFormData;
    setData: <K extends keyof ServiceFormData>(
        key: K,
        value: ServiceFormData[K],
    ) => void;
    errors: Partial<Record<keyof ServiceFormData, string>>;
    processing: boolean;
    imagePreview?: string | null;
    submitLabel: string;
}) {
    return (
        <div className="max-w-2xl space-y-5">
            <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                    id="title"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    required
                />
                <InputError message={errors.title} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="summary">Summary</Label>
                <Textarea
                    id="summary"
                    rows={2}
                    value={data.summary}
                    onChange={(e) => setData('summary', e.target.value)}
                    required
                />
                <InputError message={errors.summary} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    rows={5}
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                />
                <InputError message={errors.description} />
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
                <Label htmlFor="image">Image</Label>
                {imagePreview && (
                    <img
                        src={imagePreview}
                        alt=""
                        className="h-24 w-auto rounded-md border border-border object-cover"
                    />
                )}
                <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                        setData('image', e.target.files?.[0] ?? null)
                    }
                />
                <InputError message={errors.image} />
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
