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
import { Textarea } from '@/components/ui/textarea';
import apply from '@/routes/apply';
import type { EmploymentHistoryRow } from '@/types';

const BLANK_ROW: EmploymentHistoryRow = {
    employer_name: '',
    job_title: '',
    employment_type: '',
    city: '',
    state: '',
    country: '',
    start_date: '',
    end_date: '',
    is_current: false,
    responsibilities: '',
    supervisor_name: '',
    supervisor_contact: '',
    reason_for_leaving: '',
};

export default function ApplyEmploymentHistory({
    rows,
}: {
    rows: EmploymentHistoryRow[];
}) {
    const { data, setData, put, processing, errors } = useForm({
        rows: rows.length > 0 ? rows : [],
    });
    const rowErrors = errors as Record<string, string | undefined>;

    function submit(event: React.FormEvent) {
        event.preventDefault();
        put(apply.employmentHistory.update().url);
    }

    function updateRow(index: number, patch: Partial<EmploymentHistoryRow>) {
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
            <PageHead title="Employment History" />

            <ApplyWizardCard
                step={4}
                title="Employment history"
                description="Add your recent caregiving roles. New to the field? Skip this step."
            >
                <form onSubmit={submit} className="space-y-6">
                    {data.rows.map((row, index) => (
                        <div key={index} className="space-y-4">
                            {index > 0 && <Separator />}

                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-foreground">
                                    Position {index + 1}
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
                                <div className="grid gap-2">
                                    <Label>Employer Name</Label>
                                    <Input
                                        value={row.employer_name}
                                        onChange={(e) =>
                                            updateRow(index, {
                                                employer_name: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                    <InputError
                                        message={
                                            rowErrors[
                                                `rows.${index}.employer_name`
                                            ]
                                        }
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label>Job Title</Label>
                                    <Input
                                        value={row.job_title}
                                        onChange={(e) =>
                                            updateRow(index, {
                                                job_title: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                    <InputError
                                        message={
                                            rowErrors[`rows.${index}.job_title`]
                                        }
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label>City</Label>
                                    <Input
                                        value={row.city ?? ''}
                                        onChange={(e) =>
                                            updateRow(index, {
                                                city: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label>State</Label>
                                    <Input
                                        value={row.state ?? ''}
                                        onChange={(e) =>
                                            updateRow(index, {
                                                state: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label>Start Date</Label>
                                    <Input
                                        type="date"
                                        value={row.start_date}
                                        onChange={(e) =>
                                            updateRow(index, {
                                                start_date: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                    <InputError
                                        message={
                                            rowErrors[
                                                `rows.${index}.start_date`
                                            ]
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
                                        I currently work here
                                    </Label>
                                </div>

                                <div className="grid gap-2 sm:col-span-2">
                                    <Label>Responsibilities (optional)</Label>
                                    <Textarea
                                        rows={2}
                                        value={row.responsibilities ?? ''}
                                        onChange={(e) =>
                                            updateRow(index, {
                                                responsibilities:
                                                    e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    <Button type="button" variant="outline" onClick={addRow}>
                        <Plus className="size-4" />
                        Add a Position
                    </Button>

                    <div className="flex items-center gap-3 pt-2">
                        <Button type="submit" disabled={processing} size="lg">
                            {processing ? 'Saving...' : 'Continue'}
                        </Button>
                    </div>
                </form>
            </ApplyWizardCard>
        </>
    );
}
