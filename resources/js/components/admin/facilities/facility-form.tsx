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

const FACILITY_TYPES = [
    { value: 'hospital', label: 'Hospital' },
    { value: 'skilled_nursing_facility', label: 'Skilled Nursing Facility' },
    { value: 'assisted_living', label: 'Assisted Living' },
    { value: 'home_health', label: 'Home Health' },
    { value: 'hospice', label: 'Hospice' },
    { value: 'rehabilitation_center', label: 'Rehabilitation Center' },
    { value: 'other', label: 'Other' },
];

export type FacilityFormData = {
    name: string;
    address_line1: string;
    city: string;
    state: string;
    postal_code: string;
    contact_name: string;
    contact_phone: string;
    contact_email: string;
    facility_type: string;
    is_active: boolean;
};

export function FacilityForm({
    data,
    setData,
    errors,
    processing,
    submitLabel,
}: {
    data: FacilityFormData;
    setData: <K extends keyof FacilityFormData>(
        key: K,
        value: FacilityFormData[K],
    ) => void;
    errors: Partial<Record<keyof FacilityFormData, string>>;
    processing: boolean;
    submitLabel: string;
}) {
    return (
        <div className="max-w-xl space-y-5">
            <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    placeholder="Riverside General Hospital"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    required
                />
                <InputError message={errors.name} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="facility_type">Facility Type</Label>
                <Select
                    value={data.facility_type}
                    onValueChange={(value) => setData('facility_type', value)}
                >
                    <SelectTrigger id="facility_type">
                        <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent>
                        {FACILITY_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                                {type.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <InputError message={errors.facility_type} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="address_line1">Address</Label>
                <Input
                    id="address_line1"
                    value={data.address_line1}
                    onChange={(e) => setData('address_line1', e.target.value)}
                    required
                />
                <InputError message={errors.address_line1} />
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
                <div className="grid gap-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                        id="city"
                        value={data.city}
                        onChange={(e) => setData('city', e.target.value)}
                        required
                    />
                    <InputError message={errors.city} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                        id="state"
                        value={data.state}
                        onChange={(e) => setData('state', e.target.value)}
                        required
                    />
                    <InputError message={errors.state} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="postal_code">Postal Code</Label>
                    <Input
                        id="postal_code"
                        value={data.postal_code}
                        onChange={(e) => setData('postal_code', e.target.value)}
                        required
                    />
                    <InputError message={errors.postal_code} />
                </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
                <div className="grid gap-2">
                    <Label htmlFor="contact_name">
                        Contact Name (optional)
                    </Label>
                    <Input
                        id="contact_name"
                        value={data.contact_name}
                        onChange={(e) =>
                            setData('contact_name', e.target.value)
                        }
                    />
                    <InputError message={errors.contact_name} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="contact_phone">
                        Contact Phone (optional)
                    </Label>
                    <Input
                        id="contact_phone"
                        value={data.contact_phone}
                        onChange={(e) =>
                            setData('contact_phone', e.target.value)
                        }
                    />
                    <InputError message={errors.contact_phone} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="contact_email">
                        Contact Email (optional)
                    </Label>
                    <Input
                        id="contact_email"
                        type="email"
                        value={data.contact_email}
                        onChange={(e) =>
                            setData('contact_email', e.target.value)
                        }
                    />
                    <InputError message={errors.contact_email} />
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
