import { Head, useForm } from '@inertiajs/react';
import { FileText } from 'lucide-react';
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
import admin from '@/routes/admin';

type JobApplicationDetail = {
    id: number;
    full_name: string;
    email: string;
    phone: string;
    cover_note: string | null;
    status: string;
    created_at: string;
    job_listing: { id: number; title: string } | null;
    reviewer: { id: number; name: string } | null;
};

export default function JobApplicationsShow({
    application,
    resumeUrl,
}: {
    application: JobApplicationDetail;
    resumeUrl: string;
}) {
    const { data, setData, put, processing } = useForm({
        status: application.status,
    });

    function submit(event: React.FormEvent) {
        event.preventDefault();
        put(admin.jobApplications.update(application.id).url, {
            preserveScroll: true,
        });
    }

    return (
        <>
            <Head title={application.full_name} />
            <div className="p-4 sm:p-6">
                <AdminPageHeader
                    title={application.full_name}
                    description={
                        application.job_listing?.title ?? 'General Application'
                    }
                />

                <div className="grid max-w-3xl gap-6 sm:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Applicant Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <p>
                                <span className="text-muted-foreground">
                                    Email:
                                </span>{' '}
                                {application.email}
                            </p>
                            <p>
                                <span className="text-muted-foreground">
                                    Phone:
                                </span>{' '}
                                {application.phone}
                            </p>
                            <p>
                                <span className="text-muted-foreground">
                                    Submitted:
                                </span>{' '}
                                {new Date(
                                    application.created_at,
                                ).toLocaleString()}
                            </p>
                            {application.cover_note && (
                                <p>
                                    <span className="text-muted-foreground">
                                        Note:
                                    </span>{' '}
                                    {application.cover_note}
                                </p>
                            )}
                            <a
                                href={resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
                            >
                                <FileText className="size-4" />
                                View Resume
                            </a>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4">
                                <StatusBadge status={application.status} />
                            </div>
                            {application.reviewer && (
                                <p className="mb-4 text-xs text-muted-foreground">
                                    Last reviewed by {application.reviewer.name}
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
                                        <SelectItem value="reviewing">
                                            Reviewing
                                        </SelectItem>
                                        <SelectItem value="shortlisted">
                                            Shortlisted
                                        </SelectItem>
                                        <SelectItem value="hired">
                                            Hired
                                        </SelectItem>
                                        <SelectItem value="rejected">
                                            Rejected
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Saving...' : 'Update Status'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

JobApplicationsShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Applications', href: admin.jobApplications.index() },
    ],
};
