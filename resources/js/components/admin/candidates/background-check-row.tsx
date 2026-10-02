import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { StatusBadge } from '@/components/admin/status-badge';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import admin from '@/routes/admin';
import type { ApplicationBackgroundCheckEntry } from '@/types';

export function BackgroundCheckRow({
    check,
}: {
    check: ApplicationBackgroundCheckEntry;
}) {
    const [showResultPanel, setShowResultPanel] = useState(false);
    const { data, setData, put, processing } = useForm({
        status: 'clear',
        notes: '',
    });

    function submit(event: React.FormEvent) {
        event.preventDefault();
        put(admin.backgroundChecks.update(check.id).url, {
            preserveScroll: true,
            onSuccess: () => setShowResultPanel(false),
        });
    }

    const isResolved = check.status !== 'initiated';

    return (
        <div className="rounded-md border border-border p-2 text-xs">
            <div className="flex items-center justify-between">
                <div>
                    <p className="font-medium text-foreground">
                        {check.provider}
                    </p>
                    <p className="text-muted-foreground">
                        Initiated{' '}
                        {new Date(check.initiated_at).toLocaleDateString()}
                        {check.initiated_by && ` · ${check.initiated_by.name}`}
                    </p>
                    {check.notes && (
                        <p className="mt-1 text-muted-foreground">
                            {check.notes}
                        </p>
                    )}
                </div>
                <StatusBadge status={check.status} />
            </div>

            {!isResolved && (
                <div className="mt-2">
                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setShowResultPanel(!showResultPanel)}
                    >
                        {showResultPanel ? 'Cancel' : 'Record Result'}
                    </Button>

                    {showResultPanel && (
                        <form
                            onSubmit={submit}
                            className="mt-2 space-y-2 rounded-lg border border-border p-3"
                        >
                            <Select
                                value={data.status}
                                onValueChange={(value) =>
                                    setData('status', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="clear">Clear</SelectItem>
                                    <SelectItem value="consider">
                                        Consider
                                    </SelectItem>
                                    <SelectItem value="flagged">
                                        Flagged
                                    </SelectItem>
                                    <SelectItem value="cancelled">
                                        Cancelled
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <Textarea
                                rows={2}
                                placeholder="Notes (optional)"
                                value={data.notes}
                                onChange={(e) =>
                                    setData('notes', e.target.value)
                                }
                            />
                            <Button
                                type="submit"
                                size="sm"
                                disabled={processing}
                            >
                                {processing ? 'Saving...' : 'Save Result'}
                            </Button>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
}
