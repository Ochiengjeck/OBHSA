import { useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { ApplyWizardCard } from '@/components/public/apply-wizard-card';
import { PageHead } from '@/components/public/page-head';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import apply from '@/routes/apply';

export default function ApplyConsent({
    signatureDefault,
}: {
    signatureDefault: string;
}) {
    const { data, setData, put, processing, errors } = useForm({
        information_accurate: false,
        background_check_consent: false,
        signature_name: signatureDefault,
    });

    function submit(event: React.FormEvent) {
        event.preventDefault();
        put(apply.consent.update().url);
    }

    return (
        <>
            <PageHead title="Consent" />

            <ApplyWizardCard
                step={7}
                title="Consent & signature"
                description="Just a few confirmations before you review your application."
            >
                <form onSubmit={submit} className="space-y-6">
                    <div className="flex items-start gap-3">
                        <Checkbox
                            id="information_accurate"
                            className="mt-0.5"
                            checked={data.information_accurate}
                            onCheckedChange={(checked) =>
                                setData(
                                    'information_accurate',
                                    checked === true,
                                )
                            }
                        />
                        <Label
                            htmlFor="information_accurate"
                            className="font-normal"
                        >
                            I confirm that all information provided in this
                            application is accurate to the best of my knowledge.
                        </Label>
                    </div>
                    <InputError message={errors.information_accurate} />

                    <div className="flex items-start gap-3">
                        <Checkbox
                            id="background_check_consent"
                            className="mt-0.5"
                            checked={data.background_check_consent}
                            onCheckedChange={(checked) =>
                                setData(
                                    'background_check_consent',
                                    checked === true,
                                )
                            }
                        />
                        <Label
                            htmlFor="background_check_consent"
                            className="font-normal"
                        >
                            I consent to a background check and drug screening
                            as a condition of employment, if offered.
                        </Label>
                    </div>
                    <InputError message={errors.background_check_consent} />

                    <div className="grid gap-2">
                        <Label htmlFor="signature_name">
                            Type your full name as your signature
                        </Label>
                        <Input
                            id="signature_name"
                            value={data.signature_name}
                            onChange={(e) =>
                                setData('signature_name', e.target.value)
                            }
                            required
                        />
                        <InputError message={errors.signature_name} />
                    </div>

                    <Button type="submit" disabled={processing} size="lg">
                        {processing ? 'Saving...' : 'Continue to Review'}
                    </Button>
                </form>
            </ApplyWizardCard>
        </>
    );
}
