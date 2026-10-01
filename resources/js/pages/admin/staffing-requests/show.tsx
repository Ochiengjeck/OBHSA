import { Head, useForm } from '@inertiajs/react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { StatusBadge } from '@/components/admin/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import admin from '@/routes/admin';

type StaffingRequestDetail = {
    id: number;
    facility_name: string;
    contact_name: string;
    email: string;
    phone: string;
    facility_type: string | null;
    staffing_needs: string | null;
    status: string;
    notes: string | null;
    created_at: string;
    handler: { id: number; name: string } | null;
};

export default function StaffingRequestsShow({
    staffingRequest,
}: {
    staffingRequest: StaffingRequestDetail;
}) {
    const { data, setData, put, processing } = useForm({
        status: staffingRequest.status,
        notes: staffingRequest.notes ?? '',
    });

    function submit(event: React.FormEvent) {
        event.preventDefault();
        put(admin.staffingRequests.update(staffingRequest.id).url, {
            preserveScroll: true,
        });
    }

    return (
        <>
            <Head title={staffingRequest.facility_name} />
            <div className="p-4 sm:p-6">
                <AdminPageHeader
                    title={staffingRequest.facility_name}
                    description={staffingRequest.facility_type ?? undefined}
                />

                <div className="grid max-w-3xl gap-6 sm:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Request Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <p>
                                <span className="text-muted-foreground">
                                    Contact:
                                </span>{' '}
                                {staffingRequest.contact_name}
                            </p>
                            <p>
                                <span className="text-muted-foreground">
                                    Email:
                                </span>{' '}
                                {staffingRequest.email}
                            </p>
                            <p>
                                <span className="text-muted-foreground">
                                    Phone:
                                </span>{' '}
                                {staffingRequest.phone}
                            </p>
                            <p>
                                <span className="text-muted-foreground">
                                    Submitted:
                                </span>{' '}
                                {new Date(
                                    staffingRequest.created_at,
                                ).toLocaleString()}
                            </p>
                            {staffingRequest.staffing_needs && (
                                <p>
                                    <span className="text-muted-foreground">
                                        Needs:
                                    </span>{' '}
                                    {staffingRequest.staffing_needs}
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4">
                                <StatusBadge status={staffingRequest.status} />
                            </div>
                            {staffingRequest.handler && (
                                <p className="mb-4 text-xs text-muted-foreground">
                                    Last handled by{' '}
                                    {staffingRequest.handler.name}
                                </p>
                            )}
                            <form onSubmit={submit} className="space-y-4">
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
                                        <SelectItem value="new">New</SelectItem>
                                        <SelectItem value="contacted">
                                            Contacted
                                        </SelectItem>
                                        <SelectItem value="qualified">
                                            Qualified
                                        </SelectItem>
                                        <SelectItem value="closed">
                                            Closed
                                        </SelectItem>
                                    </SelectContent>
                                </Select>

                                <div className="grid gap-2">
                                    <Label htmlFor="notes">
                                        Internal Notes
                                    </Label>
                                    <Textarea
                                        id="notes"
                                        rows={4}
                                        value={data.notes}
                                        onChange={(e) =>
                                            setData('notes', e.target.value)
                                        }
                                    />
                                </div>

                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Saving...' : 'Update'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

StaffingRequestsShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Staffing Requests', href: admin.staffingRequests.index() },
    ],
};
