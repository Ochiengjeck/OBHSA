import { Head, Link, router } from '@inertiajs/react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { StatusBadge } from '@/components/admin/status-badge';
import { PaginationLinks } from '@/components/pagination-links';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import admin from '@/routes/admin';
import type { ComplianceCredentialRow, Paginated } from '@/types';

export default function ComplianceIndex({
    credentials,
    filters,
}: {
    credentials: Paginated<ComplianceCredentialRow>;
    filters: { filter: string | null };
}) {
    function updateFilter(value: string | null) {
        router.get(
            admin.compliance.index().url,
            { filter: value ?? undefined },
            { preserveState: true, replace: true },
        );
    }

    return (
        <>
            <Head title="Compliance" />
            <div className="p-4 sm:p-6">
                <AdminPageHeader
                    title="Compliance"
                    description="Active employees' credentials expiring within 90 days, most urgent first."
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

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Employee</TableHead>
                            <TableHead>Credential</TableHead>
                            <TableHead>Expiry Date</TableHead>
                            <TableHead>Verification</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {credentials.data.map((credential) => {
                            const isOverdue =
                                new Date(credential.expiry_date) < new Date();

                            return (
                                <TableRow key={credential.id}>
                                    <TableCell>
                                        <Link
                                            href={admin.candidates.show(
                                                credential.candidate.id,
                                            )}
                                            className="font-medium text-primary hover:underline"
                                        >
                                            {credential.candidate.full_name}
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
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>

                <div className="mt-6">
                    <PaginationLinks links={credentials.links} />
                </div>
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
