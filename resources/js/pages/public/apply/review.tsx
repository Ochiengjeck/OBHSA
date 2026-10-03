import { Link, useForm } from '@inertiajs/react';
import {
    Briefcase,
    FileText,
    GraduationCap,
    MapPin,
    ShieldCheck,
    User,
    type LucideIcon,
} from 'lucide-react';
import { ApplyWizardCard } from '@/components/public/apply-wizard-card';
import { PageHead } from '@/components/public/page-head';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import apply from '@/routes/apply';
import type { WizardApplicationReview } from '@/types';

function ReviewSection({
    icon: Icon,
    title,
    editHref,
    children,
}: {
    icon: LucideIcon;
    title: string;
    editHref: string;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-lg border border-border p-4 sm:p-5">
            <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Icon className="size-4 text-primary" />
                    {title}
                </h3>
                <Link
                    href={editHref}
                    className="text-xs font-medium text-primary hover:underline"
                >
                    Edit
                </Link>
            </div>
            <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                {children}
            </div>
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
                stepKey="review"
                title="Review your application"
                description="Make sure everything looks right before you submit."
            >
                <form onSubmit={submit} className="space-y-4">
                    <ReviewSection
                        icon={User}
                        title="Contact"
                        editHref={apply.create().url}
                    >
                        <p>{candidate.full_name}</p>
                        <p>{candidate.email}</p>
                        <p>{candidate.phone}</p>
                    </ReviewSection>

                    <ReviewSection
                        icon={MapPin}
                        title="Location"
                        editHref={apply.location.edit().url}
                    >
                        <p>
                            {candidate.city}, {candidate.state}
                        </p>
                    </ReviewSection>

                    <ReviewSection
                        icon={Briefcase}
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

                    <ReviewSection
                        icon={Briefcase}
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

                    <ReviewSection
                        icon={GraduationCap}
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

                    <ReviewSection
                        icon={FileText}
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

                    <ReviewSection
                        icon={ShieldCheck}
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
