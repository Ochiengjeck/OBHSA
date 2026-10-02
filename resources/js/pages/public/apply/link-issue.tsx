import { useForm } from '@inertiajs/react';
import { LinkIcon } from 'lucide-react';
import InputError from '@/components/input-error';
import { PageHead } from '@/components/public/page-head';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import apply from '@/routes/apply';

export default function ApplyLinkIssue({
    reason,
}: {
    reason: 'invalid' | 'expired';
}) {
    const { data, setData, post, processing, errors, wasSuccessful } = useForm({
        email: '',
    });

    function submit(event: React.FormEvent) {
        event.preventDefault();
        post(apply.resend().url);
    }

    return (
        <>
            <PageHead title="Application Link" />

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
                                ? "Resume links are valid for 14 days. Enter your email and we'll send you a fresh one."
                                : "We couldn't find an application for this link. If you started one, enter your email below and we'll send you a fresh link."}
                        </p>

                        {wasSuccessful ? (
                            <p className="text-sm font-medium text-primary">
                                If we found an application for that email, a new
                                link is on its way.
                            </p>
                        ) : (
                            <form
                                onSubmit={submit}
                                className="w-full space-y-3 text-left"
                            >
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                    required
                                />
                                <InputError message={errors.email} />

                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full"
                                >
                                    {processing
                                        ? 'Sending...'
                                        : 'Send Me a New Link'}
                                </Button>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </section>
        </>
    );
}
