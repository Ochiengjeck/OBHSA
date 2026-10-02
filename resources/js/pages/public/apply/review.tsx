import { Link, useForm } from '@inertiajs/react';
import { ApplyWizardCard } from '@/components/public/apply-wizard-card';
import { PageHead } from '@/components/public/page-head';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import apply from '@/routes/apply';
import type { WizardApplicationReview } from '@/types';

function ReviewSection({
    title,
    editHref,
    children,
}: {
    title: string;
    editHref: string;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">
                    {title}
                </h3>
                <Link
                    href={editHref}
                    className="text-xs font-medium text-primary hover:underline"
                >
                    Edit
                </Link>
            </div>
            <div className="text-sm text-muted-foreground">{children}</div>
        </div>
    );
}

export default function ApplyReview({
    application,
}: {
    application: WizardApplicationReview;
}) {
    const { post, processing } = useForm();
    const { candidate } = application;

    function submit(event: React.FormEvent) {
        event.preventDefault();
        post(apply.submit().url);
    }

    const resume = application.documents.find(
        (document) => document.document_type === 'resume',
    );

    return (
        <>
            <PageHead title="Review Your Application" />

            <ApplyWizardCard
                step={8}
                title="Review your application"
                description="Make sure everything looks right before you submit."
            >
                <form onSubmit={submit} className="space-y-6">
                    <ReviewSection
                        title="Contact"
                        editHref={apply.location.edit().url}
                    >
                        <p>{candidate.full_name}</p>
                        <p>{candidate.email}</p>
                        <p>{candidate.phone}</p>
                        <p>
                            {candidate.city}, {candidate.state}
                        </p>
                    </ReviewSection>

                    <Separator />

                    <ReviewSection
                        title="Preferences"
                        editHref={apply.preferences.edit().url}
                    >
                        <p>
                            {application.primary_specialty}
                            {application.secondary_specialty &&
                                ` / ${application.secondary_specialty}`}
                        </p>
                        <p>{application.desired_employment_type}</p>
                        <div className="mt-1 flex flex-wrap gap-1">
                            {application.work_settings?.map((setting) => (
                                <Badge key={setting} variant="secondary">
                                    {setting.replaceAll('_', ' ')}
                                </Badge>
                            ))}
                        </div>
                    </ReviewSection>

                    <Separator />

                    <ReviewSection
                        title="Employment History"
                        editHref={apply.employmentHistory.edit().url}
                    >
                        {candidate.employment_history.length === 0 ? (
                            <p>None provided.</p>
                        ) : (
                            candidate.employment_history.map((row, i) => (
                                <p key={i}>
                                    {row.job_title} &middot; {row.employer_name}
                                </p>
                            ))
                        )}
                    </ReviewSection>

                    <Separator />

                    <ReviewSection
                        title="Education"
                        editHref={apply.education.edit().url}
                    >
                        {candidate.education.length === 0 ? (
                            <p>None provided.</p>
                        ) : (
                            candidate.education.map((row, i) => (
                                <p key={i}>{row.institution_name}</p>
                            ))
                        )}
                    </ReviewSection>

                    <Separator />

                    <ReviewSection
                        title="Resume & Credentials"
                        editHref={apply.documents.edit().url}
                    >
                        <p>
                            {resume
                                ? resume.original_filename
                                : 'No resume uploaded.'}
                        </p>
                        {candidate.credentials.map((credential) => (
                            <p key={credential.id}>
                                {credential.credential_name}
                            </p>
                        ))}
                    </ReviewSection>

                    <Separator />

                    <ReviewSection
                        title="Consent"
                        editHref={apply.consent.edit().url}
                    >
                        <p>Signed by {application.consent_signature_name}</p>
                    </ReviewSection>

                    <Button
                        type="submit"
                        disabled={processing}
                        size="lg"
                        className="w-full"
                    >
                        {processing ? 'Submitting...' : 'Submit My Application'}
                    </Button>
                </form>
            </ApplyWizardCard>
        </>
    );
}
