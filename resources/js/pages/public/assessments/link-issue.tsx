import { LinkIcon } from 'lucide-react';
import { PageHead } from '@/components/public/page-head';
import { Card, CardContent } from '@/components/ui/card';

export default function AssessmentLinkIssue({
    reason,
}: {
    reason: 'invalid' | 'expired';
}) {
    return (
        <>
            <PageHead title="Assessment Link" />

            <section className="mx-auto max-w-md px-4 py-16 sm:px-6 lg:px-8">
                <Card>
                    <CardContent className="flex flex-col items-center gap-4 py-8 text-center">
                        <LinkIcon className="size-12 text-muted-foreground" />
                        <h1 className="text-2xl font-bold text-foreground">
                            {reason === 'expired'
                                ? 'This link has expired'
                                : 'This link is invalid'}
                        </h1>
                        <p className="text-muted-foreground">
                            {reason === 'expired'
                                ? 'This assessment link is no longer valid. Please contact OBHSA and we will send you a new one.'
                                : "We couldn't find an assessment for this link. Please contact OBHSA if you believe this is a mistake."}
                        </p>
                    </CardContent>
                </Card>
            </section>
        </>
    );
}
