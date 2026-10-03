import { useForm } from '@inertiajs/react';
import { FileText } from 'lucide-react';
import InputError from '@/components/input-error';
import { ApplyWizardCard } from '@/components/public/apply-wizard-card';
import { PageHead } from '@/components/public/page-head';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import apply from '@/routes/apply';

export default function ApplyDocuments({
    resumeUrl,
    resumeFilename,
}: {
    resumeUrl: string | null;
    resumeFilename: string | null;
}) {
    const { data, setData, put, processing, errors } = useForm({
        resume: null as File | null,
        add_credential: false,
        credential_type: '',
        credential_name: '',
        credential_number: '',
        issuing_authority: '',
        jurisdiction: '',
        issue_date: '',
        expiry_date: '',
        credential_scan: null as File | null,
    });

    function submit(event: React.FormEvent) {
        event.preventDefault();
        put(apply.documents.update().url, { forceFormData: true });
    }

    return (
        <>
            <PageHead title="Resume & Credentials" />

            <ApplyWizardCard
                stepKey="documents"
                title="Resume & credentials"
                description="Upload your resume. If you already hold an active license or certification, you can add it now."
            >
                <form onSubmit={submit} className="space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="resume">
                            Resume (PDF or Word, max 5MB)
                        </Label>
                        {resumeUrl && (
                            <a
                                href={resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                            >
                                <FileText className="size-4" />
                                {resumeFilename ?? 'Current resume on file'}
                            </a>
                        )}
                        <Input
                            id="resume"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) =>
                                setData('resume', e.target.files?.[0] ?? null)
                            }
                            required={!resumeUrl}
                        />
                        <InputError message={errors.resume} />
                    </div>

                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="add_credential"
                            checked={data.add_credential}
                            onCheckedChange={(checked) =>
                                setData('add_credential', checked === true)
                            }
                        />
                        <Label htmlFor="add_credential" className="font-normal">
                            I'd like to add a license or certification now
                        </Label>
                    </div>

                    {data.add_credential && (
                        <div className="grid gap-4 rounded-lg border border-border p-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="credential_type">Type</Label>
                                <Select
                                    value={data.credential_type}
                                    onValueChange={(value) =>
                                        setData('credential_type', value)
                                    }
                                >
                                    <SelectTrigger id="credential_type">
                                        <SelectValue placeholder="Select one" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="license">
                                            License
                                        </SelectItem>
                                        <SelectItem value="certification">
                                            Certification
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.credential_type} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="credential_name">Name</Label>
                                <Input
                                    id="credential_name"
                                    placeholder="e.g. RN License"
                                    value={data.credential_name}
                                    onChange={(e) =>
                                        setData(
                                            'credential_name',
                                            e.target.value,
                                        )
                                    }
                                />
                                <InputError message={errors.credential_name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="credential_number">
                                    Number (optional)
                                </Label>
                                <Input
                                    id="credential_number"
                                    value={data.credential_number}
                                    onChange={(e) =>
                                        setData(
                                            'credential_number',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="jurisdiction">
                                    Jurisdiction (optional)
                                </Label>
                                <Input
                                    id="jurisdiction"
                                    placeholder="e.g. NH"
                                    value={data.jurisdiction}
                                    onChange={(e) =>
                                        setData('jurisdiction', e.target.value)
                                    }
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="issuing_authority">
                                    Issuing Authority (optional)
                                </Label>
                                <Input
                                    id="issuing_authority"
                                    value={data.issuing_authority}
                                    onChange={(e) =>
                                        setData(
                                            'issuing_authority',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="expiry_date">
                                    Expiry Date (optional)
                                </Label>
                                <Input
                                    id="expiry_date"
                                    type="date"
                                    value={data.expiry_date}
                                    onChange={(e) =>
                                        setData('expiry_date', e.target.value)
                                    }
                                />
                            </div>

                            <div className="grid gap-2 sm:col-span-2">
                                <Label htmlFor="credential_scan">
                                    Scan or Photo (optional)
                                </Label>
                                <Input
                                    id="credential_scan"
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={(e) =>
                                        setData(
                                            'credential_scan',
                                            e.target.files?.[0] ?? null,
                                        )
                                    }
                                />
                                <InputError message={errors.credential_scan} />
                            </div>
                        </div>
                    )}

                    <Button type="submit" disabled={processing} size="lg">
                        {processing ? 'Saving...' : 'Continue'}
                    </Button>
                </form>
            </ApplyWizardCard>
        </>
    );
}
