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
import { CAREGIVER_SPECIALTIES } from '@/lib/caregiver-specialties';

export type InterviewQuestionFormData = {
    question: string;
    specialty: string;
    is_active: boolean;
    position: number;
};

export function InterviewQuestionForm({
    data,
    setData,
    errors,
    processing,
    submitLabel,
}: {
    data: InterviewQuestionFormData;
    setData: <K extends keyof InterviewQuestionFormData>(
        key: K,
        value: InterviewQuestionFormData[K],
    ) => void;
    errors: Partial<Record<keyof InterviewQuestionFormData, string>>;
    processing: boolean;
    submitLabel: string;
}) {
    return (
        <div className="max-w-xl space-y-5">
            <div className="grid gap-2">
                <Label htmlFor="question">Question</Label>
                <Textarea
                    id="question"
                    rows={3}
                    value={data.question}
                    onChange={(e) => setData('question', e.target.value)}
                    required
                />
                <InputError message={errors.question} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="specialty">Specialty</Label>
                <Select
                    value={data.specialty || 'general'}
                    onValueChange={(value) =>
                        setData('specialty', value === 'general' ? '' : value)
                    }
                >
                    <SelectTrigger id="specialty">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="general">
                            General (every specialty)
                        </SelectItem>
                        {CAREGIVER_SPECIALTIES.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <InputError message={errors.specialty} />
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
