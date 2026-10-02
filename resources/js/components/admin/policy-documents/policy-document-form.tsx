import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

export type PolicyDocumentFormData = {
    title: string;
    body: string;
    is_active: boolean;
};

export function PolicyDocumentForm({
    data,
    setData,
    errors,
    processing,
    submitLabel,
}: {
    data: PolicyDocumentFormData;
    setData: <K extends keyof PolicyDocumentFormData>(
        key: K,
        value: PolicyDocumentFormData[K],
    ) => void;
    errors: Partial<Record<keyof PolicyDocumentFormData, string>>;
    processing: boolean;
    submitLabel: string;
}) {
    return (
        <div className="max-w-2xl space-y-5">
            <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                    id="title"
                    placeholder="PTO Accrual Policy"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    required
                />
                <InputError message={errors.title} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="body">Body</Label>
                <Textarea
                    id="body"
                    rows={14}
                    value={data.body}
                    onChange={(e) => setData('body', e.target.value)}
                    required
                />
                <InputError message={errors.body} />
            </div>

            <div className="flex items-center gap-2">
                <Switch
                    id="is_active"
                    checked={data.is_active}
                    onCheckedChange={(checked) => setData('is_active', checked)}
                />
                <Label htmlFor="is_active">
                    Active (searchable by the copilot)
                </Label>
            </div>

            <Button type="submit" disabled={processing}>
                {processing ? 'Saving...' : submitLabel}
            </Button>
        </div>
    );
}
