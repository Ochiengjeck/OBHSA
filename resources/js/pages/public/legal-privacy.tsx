import { PageHead } from '@/components/public/page-head';

export default function LegalPrivacy() {
    return (
        <>
            <PageHead
                title="Privacy Policy"
                description="OBHSA's privacy policy."
            />

            <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Privacy Policy
                </h1>
                <div className="mt-8 space-y-6 text-muted-foreground">
                    <p>
                        Optimum Baseline Healthcare Staffing Agency (OBHSA)
                        respects your privacy. This policy describes how we
                        collect, use, and protect the personal information you
                        share with us through this site, including job
                        applications and staffing requests.
                    </p>
                    <p>
                        We collect information you provide directly, such as
                        your name, contact details, resume, and any message
                        content, in order to process job applications and
                        staffing requests. We do not sell your personal
                        information to third parties.
                    </p>
                    <p>
                        If you have questions about this policy or would like
                        your information removed from our records, please
                        contact us using the details on our Contact page.
                    </p>
                </div>
            </section>
        </>
    );
}
