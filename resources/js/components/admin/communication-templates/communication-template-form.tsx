import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export type CommunicationTemplateFormData = {
    name: string;
    subject: string;
    body: string;
};

export function CommunicationTemplateForm({
    data,
    setData,
    errors,
    processing,
    submitLabel,
}: {
    data: CommunicationTemplateFormData;
    setData: <K extends keyof CommunicationTemplateFormData>(
        key: K,
        value: CommunicationTemplateFormData[K],
    ) => void;
    errors: Partial<Record<keyof CommunicationTemplateFormData, string>>;
    processing: boolean;
    submitLabel: string;
}) {
    return (
        <div className="max-w-xl space-y-5">
            <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    placeholder="Interview Invitation"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    required
                />
                <InputError message={errors.name} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="subject">Email Subject</Label>
                <Input
                    id="subject"
                    value={data.subject}
                    onChange={(e) => setData('subject', e.target.value)}
                    required
                />
                <InputError message={errors.subject} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="body">Body</Label>
                <Textarea
                    id="body"
                    rows={8}
                    value={data.body}
                    onChange={(e) => setData('body', e.target.value)}
                    required
                />
                <p className="text-xs text-muted-foreground">
                    Use <code>{'{{candidate_name}}'}</code> and{' '}
                    <code>{'{{position}}'}</code> as placeholders — they're
                    filled in automatically when a recruiter picks this
                    template.
                </p>
                <InputError message={errors.body} />
            </div>

            <Button type="submit" disabled={processing}>
                {processing ? 'Saving...' : submitLabel}
            </Button>
        </div>
    );
}
