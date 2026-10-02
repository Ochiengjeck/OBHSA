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
import { Textarea } from '@/components/ui/textarea';
import { CAREGIVER_SPECIALTIES } from '@/lib/caregiver-specialties';

export type ShiftFormData = {
    specialty: string;
    shift_date: string;
    start_time: string;
    end_time: string;
    slots_needed: number;
    pay_rate: string;
    notes: string;
};

export function ShiftForm({
    data,
    setData,
    errors,
    processing,
    submitLabel,
}: {
    data: ShiftFormData;
    setData: <K extends keyof ShiftFormData>(
        key: K,
        value: ShiftFormData[K],
    ) => void;
    errors: Partial<Record<keyof ShiftFormData, string>>;
    processing: boolean;
    submitLabel: string;
}) {
    return (
        <div className="max-w-xl space-y-5">
            <div className="grid gap-2">
                <Label htmlFor="specialty">Specialty</Label>
                <Select
                    value={data.specialty}
                    onValueChange={(value) => setData('specialty', value)}
                >
                    <SelectTrigger id="specialty">
                        <SelectValue placeholder="Select a specialty" />
                    </SelectTrigger>
                    <SelectContent>
                        {CAREGIVER_SPECIALTIES.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <InputError message={errors.specialty} />
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
                <div className="grid gap-2">
                    <Label htmlFor="shift_date">Date</Label>
                    <Input
                        id="shift_date"
                        type="date"
                        value={data.shift_date}
                        onChange={(e) => setData('shift_date', e.target.value)}
                        required
                    />
                    <InputError message={errors.shift_date} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="start_time">Start Time</Label>
                    <Input
                        id="start_time"
                        type="time"
                        value={data.start_time}
                        onChange={(e) => setData('start_time', e.target.value)}
                        required
                    />
                    <InputError message={errors.start_time} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="end_time">End Time</Label>
                    <Input
                        id="end_time"
                        type="time"
                        value={data.end_time}
                        onChange={(e) => setData('end_time', e.target.value)}
                        required
                    />
                    <InputError message={errors.end_time} />
                </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
                <div className="grid gap-2">
                    <Label htmlFor="slots_needed">Slots Needed</Label>
                    <Input
                        id="slots_needed"
                        type="number"
                        min={1}
                        value={data.slots_needed}
                        onChange={(e) =>
                            setData('slots_needed', Number(e.target.value))
                        }
                    />
                    <InputError message={errors.slots_needed} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="pay_rate">Pay Rate (optional)</Label>
                    <Input
                        id="pay_rate"
                        placeholder="42.50"
                        value={data.pay_rate}
                        onChange={(e) => setData('pay_rate', e.target.value)}
                    />
                    <InputError message={errors.pay_rate} />
                </div>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                    id="notes"
                    rows={3}
                    value={data.notes}
                    onChange={(e) => setData('notes', e.target.value)}
                />
                <InputError message={errors.notes} />
            </div>

            <Button type="submit" disabled={processing}>
                {processing ? 'Saving...' : submitLabel}
            </Button>
        </div>
    );
}
