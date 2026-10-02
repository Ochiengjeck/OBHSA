import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { StatusBadge } from '@/components/admin/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import admin from '@/routes/admin';
import type { CandidateEmploymentHistoryEntry } from '@/types';

export function EmploymentHistoryCard({
    row,
}: {
    row: CandidateEmploymentHistoryEntry;
}) {
    const [showCheckPanel, setShowCheckPanel] = useState(false);

    const { data, setData, post, processing, reset } = useForm({
        contact_method: 'phone',
        contacted_at: '',
        outcome: 'positive',
        notes: '',
    });

    function submit(event: React.FormEvent) {
        event.preventDefault();
        post(admin.employmentHistory.referenceChecks.store(row.id).url, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setShowCheckPanel(false);
            },
        });
    }

    return (
        <div className="space-y-2 text-sm">
            <div>
                <p className="font-medium text-foreground">{row.job_title}</p>
                <p className="text-muted-foreground">{row.employer_name}</p>
                {row.supervisor_name && (
                    <p className="text-xs text-muted-foreground">
                        Supervisor: {row.supervisor_name}
                        {row.supervisor_contact &&
                            ` · ${row.supervisor_contact}`}
                    </p>
                )}
            </div>

            {row.reference_checks.length > 0 && (
                <div className="space-y-1.5">
                    {row.reference_checks.map((check) => (
                        <div
                            key={check.id}
                            className="rounded-md border border-border p-2 text-xs"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                    {new Date(
                                        check.contacted_at,
                                    ).toLocaleDateString()}{' '}
                                    &middot; {check.contact_method}
                                    {check.checked_by &&
                                        ` · ${check.checked_by.name}`}
                                </span>
                                <StatusBadge status={check.outcome} />
                            </div>
                            {check.notes && (
                                <p className="mt-1 text-muted-foreground">
                                    {check.notes}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setShowCheckPanel(!showCheckPanel)}
            >
                {showCheckPanel ? 'Cancel' : 'Log Reference Check'}
            </Button>

            {showCheckPanel && (
                <form
                    onSubmit={submit}
                    className="space-y-2 rounded-lg border border-border p-3"
                >
                    <div className="grid gap-2 sm:grid-cols-2">
                        <Select
                            value={data.contact_method}
                            onValueChange={(value) =>
                                setData('contact_method', value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="phone">Phone</SelectItem>
                                <SelectItem value="email">Email</SelectItem>
                            </SelectContent>
                        </Select>
                        <Input
                            type="datetime-local"
                            value={data.contacted_at}
                            onChange={(e) =>
                                setData('contacted_at', e.target.value)
                            }
                            required
                        />
                        <Select
                            value={data.outcome}
                            onValueChange={(value) => setData('outcome', value)}
                        >
                            <SelectTrigger className="sm:col-span-2">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="positive">
                                    Positive
                                </SelectItem>
                                <SelectItem value="negative">
                                    Negative
                                </SelectItem>
                                <SelectItem value="unable_to_reach">
                                    Unable to Reach
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Textarea
                        rows={2}
                        placeholder="Notes (optional)"
                        value={data.notes}
                        onChange={(e) => setData('notes', e.target.value)}
                    />
                    <Button type="submit" size="sm" disabled={processing}>
                        {processing ? 'Saving...' : 'Save Reference Check'}
                    </Button>
                </form>
            )}
        </div>
    );
}
