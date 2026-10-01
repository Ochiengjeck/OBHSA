import { PageHead } from '@/components/public/page-head';

export default function LegalTerms() {
    return (
        <>
            <PageHead
                title="Terms of Service"
                description="OBHSA's terms of service."
            />

            <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Terms of Service
                </h1>
                <div className="mt-8 space-y-6 text-muted-foreground">
                    <p>
                        By using this site to submit a job application or
                        staffing request, you agree to provide accurate
                        information and to be contacted by Optimum Baseline
                        Healthcare Staffing Agency (OBHSA) regarding your
                        submission.
                    </p>
                    <p>
                        Job listings on this site are subject to change and do
                        not guarantee placement or employment. Staffing
                        arrangements between OBHSA, caregivers, and partner
                        facilities are governed by separate agreements.
                    </p>
                    <p>
                        For questions about these terms, please contact us using
                        the details on our Contact page.
                    </p>
                </div>
            </section>
        </>
    );
}
