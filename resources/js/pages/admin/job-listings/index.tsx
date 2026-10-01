import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { ConfirmDeleteDialog } from '@/components/admin/confirm-delete-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { toUrl } from '@/lib/utils';
import admin from '@/routes/admin';
import type { JobListing } from '@/types';

export default function JobListingsIndex({
    jobListings,
}: {
    jobListings: JobListing[];
}) {
    return (
        <>
            <Head title="Job Listings" />
            <div className="p-4 sm:p-6">
                <AdminPageHeader
                    title="Job Listings"
                    description="Manage open shifts and positions shown on the public jobs board."
                    action={
                        <Button asChild>
                            <Link href={admin.jobListings.create()}>
                                <Plus className="size-4" />
                                New Listing
                            </Link>
                        </Button>
                    }
                />

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-0" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {jobListings.map((listing) => (
                            <TableRow key={listing.id}>
                                <TableCell className="font-medium">
                                    {listing.title}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {listing.location_city},{' '}
                                    {listing.location_state}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {listing.employment_type}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            listing.is_active
                                                ? 'default'
                                                : 'secondary'
                                        }
                                    >
                                        {listing.is_active
                                            ? 'Active'
                                            : 'Inactive'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center justify-end gap-3">
                                        <Link
                                            href={admin.jobListings.edit(
                                                listing.id,
                                            )}
                                            className="text-sm font-medium text-primary hover:underline"
                                        >
                                            Edit
                                        </Link>
                                        <ConfirmDeleteDialog
                                            url={toUrl(
                                                admin.jobListings.destroy(
                                                    listing.id,
                                                ),
                                            )}
                                            title="Delete job listing"
                                            description={`Are you sure you want to delete "${listing.title}"? This cannot be undone.`}
                                            trigger={
                                                <button className="text-sm font-medium text-destructive hover:underline">
                                                    Delete
                                                </button>
                                            }
                                        />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    );
}

JobListingsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Job Listings', href: admin.jobListings.index() },
    ],
};
