import { Head } from '@inertiajs/react';
import { FileText } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { ApplicationPanel } from '@/components/admin/candidates/application-panel';
import { CredentialCard } from '@/components/admin/candidates/credential-card';
import { EmploymentHistoryCard } from '@/components/admin/candidates/employment-history-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import admin from '@/routes/admin';
import type {
    CandidateApplication,
    CandidateDossier,
    CommunicationTemplate,
    RecruiterOption,
} from '@/types';

export default function CandidateShow({
    candidate,
    applications,
    recruiters,
    communicationTemplates,
}: {
    candidate: CandidateDossier;
    applications: CandidateApplication[];
    recruiters: RecruiterOption[];
    communicationTemplates: CommunicationTemplate[];
}) {
    return (
        <>
            <Head title={candidate.full_name} />
            <div className="p-4 sm:p-6">
                <AdminPageHeader
                    title={candidate.full_name}
                    description={candidate.email}
                />

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        {applications.map((application) => (
                            <ApplicationPanel
                                key={application.id}
                                application={application}
                                candidateFullName={candidate.full_name}
                                recruiters={recruiters}
                                templates={communicationTemplates}
                            />
                        ))}
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Candidate Profile</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-1.5 text-sm">
                                <p>
                                    <span className="text-muted-foreground">
                                        Phone:
                                    </span>{' '}
                                    {candidate.phone ?? '—'}
                                </p>
                                <p>
                                    <span className="text-muted-foreground">
                                        Location:
                                    </span>{' '}
                                    {candidate.city
                                        ? `${candidate.city}, ${candidate.state}`
                                        : '—'}
                                </p>
                                <p>
                                    <span className="text-muted-foreground">
                                        Contact Verified:
                                    </span>{' '}
                                    {candidate.contact_verified_at
                                        ? new Date(
                                              candidate.contact_verified_at,
                                          ).toLocaleDateString()
                                        : 'No'}
                                </p>
                            </CardContent>
                        </Card>

                        {candidate.credentials.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Credentials</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {candidate.credentials.map(
                                        (credential, index) => (
                                            <div key={credential.id}>
                                                {index > 0 && (
                                                    <Separator className="mb-4" />
                                                )}
                                                <CredentialCard
                                                    credential={credential}
                                                />
                                            </div>
                                        ),
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {candidate.documents.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Documents</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {candidate.documents.map((document) => (
                                        <a
                                            key={document.id}
                                            href={document.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                                        >
                                            <FileText className="size-4" />
                                            {document.original_filename}
                                        </a>
                                    ))}
                                </CardContent>
                            </Card>
                        )}

                        {candidate.employment_history.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Employment History</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {candidate.employment_history.map(
                                        (row, index) => (
                                            <div key={row.id}>
                                                {index > 0 && (
                                                    <Separator className="mb-4" />
                                                )}
                                                <EmploymentHistoryCard
                                                    row={row}
                                                />
                                            </div>
                                        ),
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {candidate.education.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Education</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2 text-sm">
                                    {candidate.education.map((row, index) => (
                                        <div key={index}>
                                            <p className="font-medium text-foreground">
                                                {row.institution_name}
                                            </p>
                                            {row.credential_earned && (
                                                <p className="text-muted-foreground">
                                                    {row.credential_earned}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

CandidateShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Applications', href: admin.jobApplications.index() },
    ],
};
