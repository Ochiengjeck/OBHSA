import { router } from '@inertiajs/react';
import { useState } from 'react';
import { PageHead } from '@/components/public/page-head';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import offers from '@/routes/offers';
import type { PublicOfferDetail } from '@/types';

export default function OfferShow({
    offer,
    token,
}: {
    offer: PublicOfferDetail;
    token: string;
}) {
    const [showDeclineForm, setShowDeclineForm] = useState(false);
    const [declineReason, setDeclineReason] = useState('');
    const [processing, setProcessing] = useState(false);

    function submit(action: 'accept' | 'decline') {
        setProcessing(true);
        router.post(
            offers.respond(token).url,
            { action, decline_reason: declineReason },
            { onFinish: () => setProcessing(false) },
        );
    }

    return (
        <>
            <PageHead title="Your Job Offer" />

            <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">
                            {offer.position}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Congratulations,{' '}
                            {offer.application.candidate.full_name}! OBHSA would
                            like to offer you this position.
                        </p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <dl className="grid gap-3 text-sm sm:grid-cols-2">
                            <div>
                                <dt className="text-muted-foreground">
                                    Pay Rate
                                </dt>
                                <dd className="font-medium text-foreground">
                                    ${offer.pay_rate}/hr
                                </dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">
                                    Employment Type
                                </dt>
                                <dd className="font-medium text-foreground capitalize">
                                    {offer.employment_type.replaceAll('_', ' ')}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">
                                    Start Date
                                </dt>
                                <dd className="font-medium text-foreground">
                                    {new Date(
                                        offer.start_date,
                                    ).toLocaleDateString()}
                                </dd>
                            </div>
                            {offer.expires_at && (
                                <div>
                                    <dt className="text-muted-foreground">
                                        Offer Expires
                                    </dt>
                                    <dd className="font-medium text-foreground">
                                        {new Date(
                                            offer.expires_at,
                                        ).toLocaleDateString()}
                                    </dd>
                                </div>
                            )}
                        </dl>

                        {offer.notes && (
                            <p className="text-sm text-muted-foreground">
                                {offer.notes}
                            </p>
                        )}

                        {!showDeclineForm ? (
                            <div className="flex flex-wrap gap-3">
                                <Button
                                    size="lg"
                                    disabled={processing}
                                    onClick={() => submit('accept')}
                                >
                                    Accept Offer
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    disabled={processing}
                                    onClick={() => setShowDeclineForm(true)}
                                >
                                    Decline Offer
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <Label htmlFor="decline_reason">
                                    Let us know why (optional)
                                </Label>
                                <Textarea
                                    id="decline_reason"
                                    rows={3}
                                    value={declineReason}
                                    onChange={(e) =>
                                        setDeclineReason(e.target.value)
                                    }
                                />
                                <div className="flex gap-3">
                                    <Button
                                        variant="destructive"
                                        disabled={processing}
                                        onClick={() => submit('decline')}
                                    >
                                        {processing
                                            ? 'Submitting...'
                                            : 'Confirm Decline'}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        onClick={() =>
                                            setShowDeclineForm(false)
                                        }
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </section>
        </>
    );
}
