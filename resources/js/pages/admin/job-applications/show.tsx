import { Head, useForm } from '@inertiajs/react';
import { FileText } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { StatusBadge } from '@/components/admin/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import admin from '@/routes/admin';

type StatusOption = { value: string; label: string };

type StageHistoryEntry = {
    id: number;
    from_status: string | null;
    to_status: string;
    reason: string | null;
    occurred_at: string;
    changed_by: { id: number; name: string } | null;
};

type RequirementEntry = {
    id: number;
    requirement_type: string;
    status: string;
    is_blocking: boolean;
};

type ApplicationDetail = {
    id: number;
    status: string;
    cover_note: string | null;
    created_at: string;
    candidate: {
        id: number;
        full_name: string;
        email: string;
        phone: string | null;
    };
    job_listing: { id: number; title: string } | null;
    requirements: RequirementEntry[];
    stage_history: StageHistoryEntry[];
};

export default function JobApplicationsShow({
    application,
    resumeUrl,
    allowedStatuses,
}: {
    application: ApplicationDetail;
    resumeUrl: string | null;
    allowedStatuses: StatusOption[];
}) {
    const { data, setData, put, processing } = useForm({
        status: allowedStatuses[0]?.value ?? '',
        reason: '',
    });

    function submit(event: React.FormEvent) {
        event.preventDefault();
        put(admin.jobApplications.update(application.id).url, {
            preserveScroll: true,
        });
    }

    return (
        <>
            <Head title={application.candidate.full_name} />
            <div className="p-4 sm:p-6">
                <AdminPageHeader
                    title={application.candidate.full_name}
                    description={
                        application.job_listing?.title ?? 'General Application'
                    }
                />

                <div className="grid max-w-4xl gap-6 sm:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Applicant Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <p>
                                <span className="text-muted-foreground">
                                    Email:
                                </span>{' '}
                                {application.candidate.email}
                            </p>
                            <p>
                                <span className="text-muted-foreground">
                                    Phone:
                                </span>{' '}
                                {application.candidate.phone}
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
                            {resumeUrl && (
                                <a
                                    href={resumeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
                                >
                                    <FileText className="size-4" />
                                    View Resume
                                </a>
                            )}
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

                            {allowedStatuses.length > 0 ? (
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
                                            {allowedStatuses.map((option) => (
                                                <SelectItem
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <div className="grid gap-2">
                                        <Label htmlFor="reason">
                                            Reason (optional)
                                        </Label>
                                        <Textarea
                                            id="reason"
                                            rows={2}
                                            value={data.reason}
                                            onChange={(e) =>
                                                setData(
                                                    'reason',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>

                                    <Button type="submit" disabled={processing}>
                                        {processing
                                            ? 'Saving...'
                                            : 'Update Status'}
                                    </Button>
                                </form>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    This application is in a terminal state — no
                                    further transitions are available.
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {application.requirements.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Requirements</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {application.requirements.map((requirement) => (
                                    <div
                                        key={requirement.id}
                                        className="flex items-center justify-between text-sm"
                                    >
                                        <span className="capitalize">
                                            {requirement.requirement_type.replaceAll(
                                                '_',
                                                ' ',
                                            )}
                                        </span>
                                        <StatusBadge
                                            status={requirement.status}
                                        />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {application.stage_history.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>History</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {application.stage_history.map((entry) => (
                                    <div key={entry.id} className="text-sm">
                                        <p>
                                            <StatusBadge
                                                status={entry.to_status}
                                            />{' '}
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(
                                                    entry.occurred_at,
                                                ).toLocaleString()}
                                                {entry.changed_by &&
                                                    ` · ${entry.changed_by.name}`}
                                            </span>
                                        </p>
                                        {entry.reason && (
                                            <p className="mt-0.5 text-xs text-muted-foreground">
                                                {entry.reason}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}
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
