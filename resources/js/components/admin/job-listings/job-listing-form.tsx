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
import { FileDropzone } from '@/components/admin/file-dropzone';

export type JobListingFormData = {
    title: string;
    specialty: string;
    employment_type: string;
    location_city: string;
    location_state: string;
    shift: string;
    pay_range_min: string;
    pay_range_max: string;
    description: string;
    requirements: string;
    image: File | null;
    is_active: boolean;
    closes_at: string;
};

export function JobListingForm({
    data,
    setData,
    errors,
    processing,
    imagePreview,
    submitLabel,
}: {
    data: JobListingFormData;
    setData: <K extends keyof JobListingFormData>(
        key: K,
        value: JobListingFormData[K],
    ) => void;
    errors: Partial<Record<keyof JobListingFormData, string>>;
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

            <div className="grid gap-5 sm:grid-cols-2">
                <div className="grid gap-2">
                    <Label htmlFor="specialty">Specialty</Label>
                    <Input
                        id="specialty"
                        placeholder="RN, LPN, CNA..."
                        value={data.specialty}
                        onChange={(e) => setData('specialty', e.target.value)}
                        required
                    />
                    <InputError message={errors.specialty} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="employment_type">Employment Type</Label>
                    <Select
                        value={data.employment_type}
                        onValueChange={(v) => setData('employment_type', v)}
                    >
                        <SelectTrigger id="employment_type">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="per-diem">Per-Diem</SelectItem>
                            <SelectItem value="prn">PRN</SelectItem>
                            <SelectItem value="full-time">Full-Time</SelectItem>
                            <SelectItem value="part-time">Part-Time</SelectItem>
                            <SelectItem value="contract">Contract</SelectItem>
                        </SelectContent>
                    </Select>
                    <InputError message={errors.employment_type} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="location_city">City</Label>
                    <Input
                        id="location_city"
                        value={data.location_city}
                        onChange={(e) =>
                            setData('location_city', e.target.value)
                        }
                        required
                    />
                    <InputError message={errors.location_city} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="location_state">State</Label>
                    <Input
                        id="location_state"
                        maxLength={2}
                        value={data.location_state}
                        onChange={(e) =>
                            setData(
                                'location_state',
                                e.target.value.toUpperCase(),
                            )
                        }
                        required
                    />
                    <InputError message={errors.location_state} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="shift">Shift</Label>
                    <Select
                        value={data.shift || 'none'}
                        onValueChange={(v) =>
                            setData('shift', v === 'none' ? '' : v)
                        }
                    >
                        <SelectTrigger id="shift">
                            <SelectValue placeholder="Not specified" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">Not specified</SelectItem>
                            <SelectItem value="day">Day</SelectItem>
                            <SelectItem value="evening">Evening</SelectItem>
                            <SelectItem value="night">Night</SelectItem>
                            <SelectItem value="rotating">Rotating</SelectItem>
                        </SelectContent>
                    </Select>
                    <InputError message={errors.shift} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="closes_at">Closes On</Label>
                    <Input
                        id="closes_at"
                        type="date"
                        value={data.closes_at}
                        onChange={(e) => setData('closes_at', e.target.value)}
                    />
                    <InputError message={errors.closes_at} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="pay_range_min">Pay Min ($/hr)</Label>
                    <Input
                        id="pay_range_min"
                        type="number"
                        min={0}
                        step="0.01"
                        value={data.pay_range_min}
                        onChange={(e) =>
                            setData('pay_range_min', e.target.value)
                        }
                    />
                    <InputError message={errors.pay_range_min} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="pay_range_max">Pay Max ($/hr)</Label>
                    <Input
                        id="pay_range_max"
                        type="number"
                        min={0}
                        step="0.01"
                        value={data.pay_range_max}
                        onChange={(e) =>
                            setData('pay_range_max', e.target.value)
                        }
                    />
                    <InputError message={errors.pay_range_max} />
                </div>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    rows={6}
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    required
                />
                <InputError message={errors.description} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea
                    id="requirements"
                    rows={4}
                    value={data.requirements}
                    onChange={(e) => setData('requirements', e.target.value)}
                />
                <InputError message={errors.requirements} />
            </div>

            <FileDropzone
                label="Photo"
                value={data.image}
                existingUrl={imagePreview ?? null}
                onChange={(file) => setData('image', file)}
                onClear={() => setData('image', null)}
                canClearExisting={false}
                previewSize="h-24 w-full max-w-xs"
                error={errors.image}
            />

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
