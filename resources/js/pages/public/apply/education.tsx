import { useForm } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import InputError from '@/components/input-error';
import { ApplyWizardCard } from '@/components/public/apply-wizard-card';
import { PageHead } from '@/components/public/page-head';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import apply from '@/routes/apply';
import type { EducationRow } from '@/types';

const BLANK_ROW: EducationRow = {
    institution_name: '',
    credential_earned: '',
    field_of_study: '',
    start_date: '',
    end_date: '',
    is_current: false,
    country: '',
    state: '',
};

export default function ApplyEducation({ rows }: { rows: EducationRow[] }) {
    const { data, setData, put, processing, errors } = useForm({
        rows: rows.length > 0 ? rows : [],
    });
    const rowErrors = errors as Record<string, string | undefined>;

    function submit(event: React.FormEvent) {
        event.preventDefault();
        put(apply.education.update().url);
    }

    function updateRow(index: number, patch: Partial<EducationRow>) {
        setData(
            'rows',
            data.rows.map((row, i) =>
                i === index ? { ...row, ...patch } : row,
            ),
        );
    }

    function addRow() {
        setData('rows', [...data.rows, { ...BLANK_ROW }]);
    }

    function removeRow(index: number) {
        setData(
            'rows',
            data.rows.filter((_, i) => i !== index),
        );
    }

    return (
        <>
            <PageHead title="Education" />

            <ApplyWizardCard
                step={5}
                title="Education"
                description="Add any relevant schooling, certification programs, or training. Skip if not applicable."
            >
                <form onSubmit={submit} className="space-y-6">
                    {data.rows.map((row, index) => (
                        <div key={index} className="space-y-4">
                            {index > 0 && <Separator />}

                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-foreground">
                                    School {index + 1}
                                </p>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeRow(index)}
                                >
                                    <Trash2 className="size-4" />
                                    Remove
                                </Button>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="grid gap-2 sm:col-span-2">
                                    <Label>Institution Name</Label>
                                    <Input
                                        value={row.institution_name}
                                        onChange={(e) =>
                                            updateRow(index, {
                                                institution_name:
                                                    e.target.value,
                                            })
                                        }
                                        required
                                    />
                                    <InputError
                                        message={
                                            rowErrors[
                                                `rows.${index}.institution_name`
                                            ]
                                        }
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label>Credential Earned</Label>
                                    <Input
                                        value={row.credential_earned ?? ''}
                                        onChange={(e) =>
                                            updateRow(index, {
                                                credential_earned:
                                                    e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label>Field of Study</Label>
                                    <Input
                                        value={row.field_of_study ?? ''}
                                        onChange={(e) =>
                                            updateRow(index, {
                                                field_of_study: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label>Start Date</Label>
                                    <Input
                                        type="date"
                                        value={row.start_date ?? ''}
                                        onChange={(e) =>
                                            updateRow(index, {
                                                start_date: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label>End Date</Label>
                                    <Input
                                        type="date"
                                        value={row.end_date ?? ''}
                                        disabled={row.is_current}
                                        onChange={(e) =>
                                            updateRow(index, {
                                                end_date: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="flex items-center gap-2 sm:col-span-2">
                                    <Checkbox
                                        checked={row.is_current}
                                        onCheckedChange={(checked) =>
                                            updateRow(index, {
                                                is_current: checked === true,
                                                end_date:
                                                    checked === true
                                                        ? ''
                                                        : row.end_date,
                                            })
                                        }
                                    />
                                    <Label className="font-normal">
                                        I'm currently enrolled here
                                    </Label>
                                </div>
                            </div>
                        </div>
                    ))}

                    <Button type="button" variant="outline" onClick={addRow}>
                        <Plus className="size-4" />
                        Add a School
                    </Button>

                    <div className="pt-2">
                        <Button type="submit" disabled={processing} size="lg">
                            {processing ? 'Saving...' : 'Continue'}
                        </Button>
                    </div>
                </form>
            </ApplyWizardCard>
        </>
    );
}
