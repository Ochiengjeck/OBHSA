import { useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { ApplyWizardCard } from '@/components/public/apply-wizard-card';
import { PageHead } from '@/components/public/page-head';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import apply from '@/routes/apply';
import { CAREGIVER_SPECIALTIES } from '@/lib/caregiver-specialties';

const EMPLOYMENT_TYPES: { value: string; label: string }[] = [
    { value: 'per-diem', label: 'Per-Diem' },
    { value: 'prn', label: 'PRN' },
    { value: 'full-time', label: 'Full-Time' },
    { value: 'part-time', label: 'Part-Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'flexible', label: "I'm Flexible" },
];

const START_TIMEFRAMES: { value: string; label: string }[] = [
    { value: 'immediately', label: 'Immediately' },
    { value: 'within_2_weeks', label: 'Within 2 Weeks' },
    { value: 'within_1_month', label: 'Within a Month' },
    { value: 'flexible', label: "I'm Flexible" },
];

const WORK_SETTINGS: { value: string; label: string }[] = [
    { value: 'hospital', label: 'Hospital' },
    { value: 'skilled_nursing_facility', label: 'Skilled Nursing Facility' },
    { value: 'assisted_living', label: 'Assisted Living' },
    { value: 'home_health', label: 'Home Health' },
    { value: 'hospice', label: 'Hospice' },
    { value: 'rehabilitation_center', label: 'Rehabilitation Center' },
    { value: 'other', label: 'Other' },
];

type PreferencesData = {
    primary_specialty: string | null;
    secondary_specialty: string | null;
    desired_employment_type: string | null;
    desired_start_timeframe: string | null;
    work_settings: string[] | null;
};

export default function ApplyPreferences({
    application,
}: {
    application: PreferencesData;
}) {
    const { data, setData, put, processing, errors } = useForm({
        primary_specialty: application.primary_specialty ?? '',
        secondary_specialty: application.secondary_specialty ?? '',
        desired_employment_type: application.desired_employment_type ?? '',
        desired_start_timeframe: application.desired_start_timeframe ?? '',
        work_settings: application.work_settings ?? ([] as string[]),
    });

    function submit(event: React.FormEvent) {
        event.preventDefault();
        put(apply.preferences.update().url);
    }

    function toggleWorkSetting(value: string, checked: boolean) {
        setData(
            'work_settings',
            checked
                ? [...data.work_settings, value]
                : data.work_settings.filter((item) => item !== value),
        );
    }

    return (
        <>
            <PageHead title="Work Preferences" />

            <ApplyWizardCard
                step={3}
                title="Your work preferences"
                description="This helps us match you with the right shifts."
            >
                <form onSubmit={submit} className="space-y-6">
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="primary_specialty">
                                Primary Specialty
                            </Label>
                            <Select
                                value={data.primary_specialty}
                                onValueChange={(value) =>
                                    setData('primary_specialty', value)
                                }
                            >
                                <SelectTrigger id="primary_specialty">
                                    <SelectValue placeholder="Select a specialty" />
                                </SelectTrigger>
                                <SelectContent>
                                    {CAREGIVER_SPECIALTIES.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.primary_specialty} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="secondary_specialty">
                                Secondary Specialty (optional)
                            </Label>
                            <Select
                                value={data.secondary_specialty}
                                onValueChange={(value) =>
                                    setData('secondary_specialty', value)
                                }
                            >
                                <SelectTrigger id="secondary_specialty">
                                    <SelectValue placeholder="None" />
                                </SelectTrigger>
                                <SelectContent>
                                    {CAREGIVER_SPECIALTIES.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.secondary_specialty} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="desired_employment_type">
                                Desired Employment Type
                            </Label>
                            <Select
                                value={data.desired_employment_type}
                                onValueChange={(value) =>
                                    setData('desired_employment_type', value)
                                }
                            >
                                <SelectTrigger id="desired_employment_type">
                                    <SelectValue placeholder="Select one" />
                                </SelectTrigger>
                                <SelectContent>
                                    {EMPLOYMENT_TYPES.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError
                                message={errors.desired_employment_type}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="desired_start_timeframe">
                                When Can You Start?
                            </Label>
                            <Select
                                value={data.desired_start_timeframe}
                                onValueChange={(value) =>
                                    setData('desired_start_timeframe', value)
                                }
                            >
                                <SelectTrigger id="desired_start_timeframe">
                                    <SelectValue placeholder="Select one" />
                                </SelectTrigger>
                                <SelectContent>
                                    {START_TIMEFRAMES.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError
                                message={errors.desired_start_timeframe}
                            />
                        </div>
                    </div>

                    <div className="grid gap-3">
                        <Label>Settings You're Open To</Label>
                        <div className="grid gap-2.5 sm:grid-cols-2">
                            {WORK_SETTINGS.map((option) => (
                                <label
                                    key={option.value}
                                    className="flex items-center gap-2 text-sm"
                                >
                                    <Checkbox
                                        checked={data.work_settings.includes(
                                            option.value,
                                        )}
                                        onCheckedChange={(checked) =>
                                            toggleWorkSetting(
                                                option.value,
                                                checked === true,
                                            )
                                        }
                                    />
                                    {option.label}
                                </label>
                            ))}
                        </div>
                        <InputError message={errors.work_settings} />
                    </div>

                    <Button type="submit" disabled={processing} size="lg">
                        {processing ? 'Saving...' : 'Continue'}
                    </Button>
                </form>
            </ApplyWizardCard>
        </>
    );
}
