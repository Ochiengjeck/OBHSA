import InputError from '@/components/input-error';
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

export type AssessmentFormData = {
    name: string;
    description: string;
    delivery_mode: string;
    passing_score: number;
    max_attempts: number;
    is_active: boolean;
};

export function AssessmentForm({
    data,
    setData,
    errors,
    processing,
    submitLabel,
}: {
    data: AssessmentFormData;
    setData: <K extends keyof AssessmentFormData>(
        key: K,
        value: AssessmentFormData[K],
    ) => void;
    errors: Partial<Record<keyof AssessmentFormData, string>>;
    processing: boolean;
    submitLabel: string;
}) {
    return (
        <div className="max-w-xl space-y-5">
            <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    placeholder="RN Clinical Skills Test"
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

            <div className="grid gap-2">
                <Label htmlFor="delivery_mode">Delivery Mode</Label>
                <Select
                    value={data.delivery_mode}
                    onValueChange={(value) => setData('delivery_mode', value)}
                >
                    <SelectTrigger id="delivery_mode">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="self_service">
                            Self-Service (candidate takes it online)
                        </SelectItem>
                        <SelectItem value="staff_administered">
                            Staff-Administered (recruiter records it)
                        </SelectItem>
                    </SelectContent>
                </Select>
                <InputError message={errors.delivery_mode} />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
                <div className="grid gap-2">
                    <Label htmlFor="passing_score">Passing Score (%)</Label>
                    <Input
                        id="passing_score"
                        type="number"
                        min={0}
                        max={100}
                        value={data.passing_score}
                        onChange={(e) =>
                            setData('passing_score', Number(e.target.value))
                        }
                    />
                    <InputError message={errors.passing_score} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="max_attempts">Max Attempts</Label>
                    <Input
                        id="max_attempts"
                        type="number"
                        min={1}
                        value={data.max_attempts}
                        onChange={(e) =>
                            setData('max_attempts', Number(e.target.value))
                        }
                    />
                    <InputError message={errors.max_attempts} />
                </div>
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
