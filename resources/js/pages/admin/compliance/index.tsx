import { Head, Link, router } from '@inertiajs/react';
import { CheckCircle2, ShieldAlert, XCircle } from 'lucide-react';
import { useState } from 'react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { EmptyState } from '@/components/admin/empty-state';
import { RowActionsMenu } from '@/components/admin/row-actions-menu';
import { StatusBadge } from '@/components/admin/status-badge';
import { PaginationLinks } from '@/components/pagination-links';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { cn, toUrl } from '@/lib/utils';
import admin from '@/routes/admin';
import type { ComplianceCredentialRow, Paginated } from '@/types';

function RejectCredentialDialog({
    credentialId,
    open,
    onOpenChange,
}: {
    credentialId: number;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [notes, setNotes] = useState('');
    const [processing, setProcessing] = useState(false);

    function handleReject() {
        setProcessing(true);
        router.put(
            toUrl(admin.credentials.reject(credentialId)),
            { notes },
            {
                preserveScroll: true,
                onFinish: () => {
                    setProcessing(false);
                    onOpenChange(false);
                    setNotes('');
                },
            },
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Reject credential</DialogTitle>
                    <DialogDescription>
                        Explain why this credential is being rejected. The
                        candidate's related requirement will be marked failed.
                    </DialogDescription>
                </DialogHeader>
                <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Reason for rejection..."
                    rows={4}
                />
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleReject}
                        disabled={processing || !notes.trim()}
                    >
                        {processing ? 'Rejecting...' : 'Reject'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function ComplianceIndex({
    credentials,
    filters,
}: {
    credentials: Paginated<ComplianceCredentialRow>;
    filters: { filter: string | null };
}) {
    const [rejectingId, setRejectingId] = useState<number | null>(null);

    function updateFilter(value: string | null) {
        router.get(
            admin.compliance.index().url,
            { filter: value ?? undefined },
            { preserveState: true, replace: true },
        );
    }

    function verify(credentialId: number) {
        router.put(
            toUrl(admin.credentials.verify(credentialId)),
            {},
            { preserveScroll: true },
        );
    }

    return (
        <>
            <Head title="Compliance" />
            <div className="p-4 sm:p-6">
                <AdminPageHeader
                    title="Compliance"
                    description="Active employees' credentials expiring within 90 days, most urgent first."
                    icon={ShieldAlert}
                    stats={[{ label: 'total', value: credentials.total }]}
                />

                <div className="mb-4 flex gap-2">
                    <Button
                        size="sm"
                        variant={!filters.filter ? 'default' : 'outline'}
                        onClick={() => updateFilter(null)}
                    >
                        All
                    </Button>
                    <Button
                        size="sm"
                        variant={
                            filters.filter === 'overdue' ? 'default' : 'outline'
                        }
                        onClick={() => updateFilter('overdue')}
                    >
                        Overdue
                    </Button>
                </div>

                {credentials.data.length === 0 ? (
                    <EmptyState
                        icon={ShieldAlert}
                        title="Nothing expiring"
                        description="Active employees' credentials expiring within 90 days will show up here."
                    />
                ) : (
                    <>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Employee</TableHead>
                                    <TableHead>Credential</TableHead>
                                    <TableHead>Expiry Date</TableHead>
                                    <TableHead>Verification</TableHead>
                                    <TableHead className="w-0" />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {credentials.data.map((credential) => {
                                    const isOverdue =
                                        new Date(credential.expiry_date) <
                                        new Date();

                                    return (
                                        <TableRow key={credential.id}>
                                            <TableCell>
                                                <Link
                                                    href={admin.candidates.show(
                                                        credential.candidate.id,
                                                    )}
                                                    className="font-medium text-primary hover:underline"
                                                >
                                                    {
                                                        credential.candidate
                                                            .full_name
                                                    }
                                                </Link>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {credential.credential_name}
                                            </TableCell>
                                            <TableCell
                                                className={cn(
                                                    'text-muted-foreground',
                                                    isOverdue &&
                                                        'font-medium text-red-600',
                                                )}
                                            >
                                                {new Date(
                                                    credential.expiry_date,
                                                ).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <StatusBadge
                                                    status={
                                                        credential.verification_status
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <RowActionsMenu>
                                                    <DropdownMenuItem asChild>
                                                        <Link
                                                            href={admin.candidates.show(
                                                                credential
                                                                    .candidate
                                                                    .id,
                                                            )}
                                                        >
                                                            View Candidate
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    {credential.verification_status !==
                                                        'verified' && (
                                                        <DropdownMenuItem
                                                            onSelect={() =>
                                                                verify(
                                                                    credential.id,
                                                                )
                                                            }
                                                        >
                                                            <CheckCircle2 className="size-4" />
                                                            Verify
                                                        </DropdownMenuItem>
                                                    )}
                                                    {credential.verification_status !==
                                                        'rejected' && (
                                                        <DropdownMenuItem
                                                            variant="destructive"
                                                            onSelect={(e) => {
                                                                e.preventDefault();
                                                                setRejectingId(
                                                                    credential.id,
                                                                );
                                                            }}
                                                        >
                                                            <XCircle className="size-4" />
                                                            Reject
                                                        </DropdownMenuItem>
                                                    )}
                                                </RowActionsMenu>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>

                        <div className="mt-6">
                            <PaginationLinks links={credentials.links} />
                        </div>
                    </>
                )}

                {rejectingId !== null && (
                    <RejectCredentialDialog
                        credentialId={rejectingId}
                        open={rejectingId !== null}
                        onOpenChange={(open) => !open && setRejectingId(null)}
                    />
                )}
            </div>
        </>
    );
}

ComplianceIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Compliance', href: admin.compliance.index() },
    ],
};
