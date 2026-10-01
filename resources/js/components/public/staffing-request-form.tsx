import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/components/input-error';
import staffingRequests from '@/routes/staffing-requests';

export function StaffingRequestForm() {
    const { data, setData, post, processing, errors, wasSuccessful } = useForm({
        facility_name: '',
        contact_name: '',
        email: '',
        phone: '',
        facility_type: '',
        staffing_needs: '',
    });

    function submit(event: React.FormEvent) {
        event.preventDefault();
        post(staffingRequests.store().url, { preserveScroll: true });
    }

    return (
        <Card id="staffing-request" className="mx-auto max-w-2xl scroll-mt-24">
            <CardHeader>
                <CardTitle>Request Staffing</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={submit} className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="facility_name">Facility Name</Label>
                            <Input
                                id="facility_name"
                                value={data.facility_name}
                                onChange={(e) =>
                                    setData('facility_name', e.target.value)
                                }
                                required
                            />
                            <InputError message={errors.facility_name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="facility_type">Facility Type</Label>
                            <Input
                                id="facility_type"
                                placeholder="e.g. Skilled Nursing, Home Health"
                                value={data.facility_type}
                                onChange={(e) =>
                                    setData('facility_type', e.target.value)
                                }
                            />
                            <InputError message={errors.facility_type} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="contact_name">Contact Name</Label>
                            <Input
                                id="contact_name"
                                value={data.contact_name}
                                onChange={(e) =>
                                    setData('contact_name', e.target.value)
                                }
                                required
                            />
                            <InputError message={errors.contact_name} />
                        </div>

                        <div className="grid gap-2">
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
                            <Label htmlFor="staffing_needs">
                                Staffing Needs
                            </Label>
                            <Textarea
                                id="staffing_needs"
                                rows={4}
                                placeholder="Roles, shifts, and timeline you need covered"
                                value={data.staffing_needs}
                                onChange={(e) =>
                                    setData('staffing_needs', e.target.value)
                                }
                            />
                            <InputError message={errors.staffing_needs} />
                        </div>
                    </div>

                    <Button type="submit" disabled={processing} size="lg">
                        {processing ? 'Submitting...' : 'Submit Request'}
                    </Button>

                    {wasSuccessful && (
                        <p className="text-sm font-medium text-primary">
                            Thanks! Our team will follow up shortly.
                        </p>
                    )}
                </form>
            </CardContent>
        </Card>
    );
}
