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

export type TestimonialFormData = {
    author_name: string;
    author_role: string;
    author_photo: File | null;
    quote: string;
    rating: number;
    position: number;
    is_featured: boolean;
};

export function TestimonialForm({
    data,
    setData,
    errors,
    processing,
    photoPreview,
    submitLabel,
}: {
    data: TestimonialFormData;
    setData: <K extends keyof TestimonialFormData>(
        key: K,
        value: TestimonialFormData[K],
    ) => void;
    errors: Partial<Record<keyof TestimonialFormData, string>>;
    processing: boolean;
    photoPreview?: string | null;
    submitLabel: string;
}) {
    return (
        <div className="max-w-2xl space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
                <div className="grid gap-2">
                    <Label htmlFor="author_name">Author Name</Label>
                    <Input
                        id="author_name"
                        value={data.author_name}
                        onChange={(e) => setData('author_name', e.target.value)}
                        required
                    />
                    <InputError message={errors.author_name} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="author_role">Author Role</Label>
                    <Input
                        id="author_role"
                        placeholder="RN, Per-Diem Caregiver"
                        value={data.author_role}
                        onChange={(e) => setData('author_role', e.target.value)}
                    />
                    <InputError message={errors.author_role} />
                </div>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="quote">Quote</Label>
                <Textarea
                    id="quote"
                    rows={4}
                    value={data.quote}
                    onChange={(e) => setData('quote', e.target.value)}
                    required
                />
                <InputError message={errors.quote} />
            </div>

            <FileDropzone
                label="Author Photo"
                shape="circle"
                value={data.author_photo}
                existingUrl={photoPreview ?? null}
                onChange={(file) => setData('author_photo', file)}
                onClear={() => setData('author_photo', null)}
                canClearExisting={false}
                error={errors.author_photo}
            />

            <div className="grid gap-5 sm:grid-cols-2">
                <div className="grid gap-2">
                    <Label htmlFor="rating">Rating</Label>
                    <Select
                        value={String(data.rating)}
                        onValueChange={(v) => setData('rating', Number(v))}
                    >
                        <SelectTrigger id="rating">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {[1, 2, 3, 4, 5].map((n) => (
                                <SelectItem key={n} value={String(n)}>
                                    {n} star{n > 1 ? 's' : ''}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <InputError message={errors.rating} />
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
            </div>

            <div className="flex items-center gap-2">
                <Switch
                    id="is_featured"
                    checked={data.is_featured}
                    onCheckedChange={(checked) =>
                        setData('is_featured', checked)
                    }
                />
                <Label htmlFor="is_featured">Featured</Label>
            </div>

            <Button type="submit" disabled={processing}>
                {processing ? 'Saving...' : submitLabel}
            </Button>
        </div>
    );
}
