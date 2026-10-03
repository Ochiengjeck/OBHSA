import { useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { ApplyWizardCard } from '@/components/public/apply-wizard-card';
import { PageHead } from '@/components/public/page-head';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import apply from '@/routes/apply';

export default function ApplyContact({
    jobListing,
    candidate,
}: {
    jobListing: { title: string; slug: string } | null;
    candidate: {
        first_name: string | null;
        last_name: string | null;
        preferred_name: string | null;
        email: string;
        phone: string | null;
    } | null;
}) {
    const { data, setData, post, processing, errors } = useForm({
        first_name: candidate?.first_name ?? '',
        last_name: candidate?.last_name ?? '',
        preferred_name: candidate?.preferred_name ?? '',
        email: candidate?.email ?? '',
        phone: candidate?.phone ?? '',
        job_listing: jobListing?.slug ?? '',
    });

    function submit(event: React.FormEvent) {
        event.preventDefault();
        post(apply.store().url);
    }

    return (
        <>
            <PageHead
                title="Apply to Join OBHSA"
                description="Start your caregiver application with Optimum Baseline Healthcare Staffing Agency."
            />

            <ApplyWizardCard
                stepKey="contact"
                title="Let's get started"
                description={
                    jobListing
                        ? `Applying toward: ${jobListing.title}`
                        : 'Tell us how to reach you. You can save your progress and finish later.'
                }
            >
                <form onSubmit={submit} className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="first_name">First Name</Label>
                            <Input
                                id="first_name"
                                value={data.first_name}
                                onChange={(e) =>
                                    setData('first_name', e.target.value)
                                }
                                required
                            />
                            <InputError message={errors.first_name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="last_name">Last Name</Label>
                            <Input
                                id="last_name"
                                value={data.last_name}
                                onChange={(e) =>
                                    setData('last_name', e.target.value)
                                }
                                required
                            />
                            <InputError message={errors.last_name} />
                        </div>

                        <div className="grid gap-2 sm:col-span-2">
                            <Label htmlFor="preferred_name">
                                Preferred Name (optional)
                            </Label>
                            <Input
                                id="preferred_name"
                                value={data.preferred_name}
                                onChange={(e) =>
                                    setData('preferred_name', e.target.value)
                                }
                            />
                            <InputError message={errors.preferred_name} />
                        </div>

                        <div className="grid gap-2 sm:col-span-2">
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
                        </div>

                        <div className="grid gap-2 sm:col-span-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                type="tel"
                                value={data.phone}
                                onChange={(e) =>
                                    setData('phone', e.target.value)
                                }
                                required
                            />
                            <InputError message={errors.phone} />
                        </div>
                    </div>

                    <p className="text-xs text-muted-foreground">
                        We'll email you a link so you can save your progress and
                        pick up where you left off.
                    </p>

                    <Button type="submit" disabled={processing} size="lg">
                        {processing ? 'Starting...' : 'Continue'}
                    </Button>
                </form>
            </ApplyWizardCard>
        </>
    );
}
