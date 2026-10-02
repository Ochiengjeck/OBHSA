import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { StatusBadge } from '@/components/admin/status-badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import admin from '@/routes/admin';
import type { CandidateCredential } from '@/types';

export function CredentialCard({
    credential,
}: {
    credential: CandidateCredential;
}) {
    const [showRejectPanel, setShowRejectPanel] = useState(false);
    const verifyForm = useForm({});
    const rejectForm = useForm({ notes: '' });

    function verify() {
        verifyForm.put(admin.credentials.verify(credential.id).url, {
            preserveScroll: true,
        });
    }

    function submitReject(event: React.FormEvent) {
        event.preventDefault();
        rejectForm.put(admin.credentials.reject(credential.id).url, {
            preserveScroll: true,
            onSuccess: () => setShowRejectPanel(false),
        });
    }

    return (
        <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
                <div>
                    <p className="font-medium text-foreground">
                        {credential.credential_name}
                    </p>
                    {credential.jurisdiction && (
                        <p className="text-xs text-muted-foreground">
                            {credential.jurisdiction}
                        </p>
                    )}
                </div>
                <StatusBadge status={credential.verification_status} />
            </div>

            {credential.notes && (
                <p className="text-xs text-muted-foreground">
                    {credential.notes}
                </p>
            )}

            <div className="flex items-center gap-2">
                <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={verifyForm.processing}
                    onClick={verify}
                >
                    Verify
                </Button>
                <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setShowRejectPanel(!showRejectPanel)}
                >
                    {showRejectPanel ? 'Cancel' : 'Reject'}
                </Button>
            </div>

            {showRejectPanel && (
                <form onSubmit={submitReject} className="space-y-2">
                    <Textarea
                        rows={2}
                        placeholder="Reason for rejection (optional)"
                        value={rejectForm.data.notes}
                        onChange={(e) =>
                            rejectForm.setData('notes', e.target.value)
                        }
                    />
                    <Button
                        type="submit"
                        size="sm"
                        variant="destructive"
                        disabled={rejectForm.processing}
                    >
                        {rejectForm.processing
                            ? 'Rejecting...'
                            : 'Confirm Reject'}
                    </Button>
                </form>
            )}
        </div>
    );
}
