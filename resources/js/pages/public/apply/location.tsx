import { useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { ApplyWizardCard } from '@/components/public/apply-wizard-card';
import { PageHead } from '@/components/public/page-head';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import apply from '@/routes/apply';

export default function ApplyLocation({
    candidate,
}: {
    candidate: {
        address_line1: string | null;
        city: string | null;
        state: string | null;
        postal_code: string | null;
    };
}) {
    const { data, setData, put, processing, errors } = useForm({
        address_line1: candidate.address_line1 ?? '',
        city: candidate.city ?? '',
        state: candidate.state ?? '',
        postal_code: candidate.postal_code ?? '',
    });

    function submit(event: React.FormEvent) {
        event.preventDefault();
        put(apply.location.update().url);
    }

    return (
        <>
            <PageHead title="Where Are You Located?" />

            <ApplyWizardCard
                stepKey="location"
                title="Where are you located?"
                description="We staff caregivers across our active service area — let's confirm we cover yours."
            >
                <form onSubmit={submit} className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div className="grid gap-2 sm:col-span-2">
                            <Label htmlFor="address_line1">
                                Street Address (optional)
                            </Label>
                            <Input
                                id="address_line1"
                                value={data.address_line1}
                                onChange={(e) =>
                                    setData('address_line1', e.target.value)
                                }
                            />
                            <InputError message={errors.address_line1} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="city">City</Label>
                            <Input
                                id="city"
                                value={data.city}
                                onChange={(e) =>
                                    setData('city', e.target.value)
                                }
                                required
                            />
                            <InputError message={errors.city} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="state">State</Label>
                            <Input
                                id="state"
                                maxLength={2}
                                placeholder="NH"
                                value={data.state}
                                onChange={(e) =>
                                    setData(
                                        'state',
                                        e.target.value.toUpperCase(),
                                    )
                                }
                                required
                            />
                            <InputError message={errors.state} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="postal_code">ZIP Code</Label>
                            <Input
                                id="postal_code"
                                value={data.postal_code}
                                onChange={(e) =>
                                    setData('postal_code', e.target.value)
                                }
                                required
                            />
                            <InputError message={errors.postal_code} />
                        </div>
                    </div>

                    <Button type="submit" disabled={processing} size="lg">
                        {processing ? 'Checking...' : 'Continue'}
                    </Button>
                </form>
            </ApplyWizardCard>
        </>
    );
}
