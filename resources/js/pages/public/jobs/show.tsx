import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Briefcase, Clock, MapPin } from 'lucide-react';
import InputError from '@/components/input-error';
import { PageHead } from '@/components/public/page-head';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { apply, index } from '@/routes/jobs';
import type { JobListing } from '@/types';

export default function JobShow({ jobListing }: { jobListing: JobListing }) {
    const { data, setData, post, processing, errors, wasSuccessful } = useForm({
        full_name: '',
        email: '',
        phone: '',
        resume: null as File | null,
        cover_note: '',
    });

    function submit(event: React.FormEvent) {
        event.preventDefault();
        post(apply(jobListing.slug).url, { forceFormData: true });
    }

    return (
        <>
            <PageHead
                title={jobListing.title}
                description={jobListing.description.slice(0, 160)}
            />

            <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
                <Button variant="ghost" size="sm" asChild className="-ml-3">
                    <Link href={index()}>
                        <ArrowLeft className="size-4" />
                        All Shifts
                    </Link>
                </Button>

                <div className="mt-6 flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">
                        {jobListing.employment_type}
                    </Badge>
                    {jobListing.shift && (
                        <Badge variant="outline">{jobListing.shift}</Badge>
                    )}
                </div>

                <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground">
                    {jobListing.title}
                </h1>

                <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                        <Briefcase className="size-4" />
                        {jobListing.specialty}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                        <MapPin className="size-4" />
                        {jobListing.location_city}, {jobListing.location_state}
                    </span>
                    {(jobListing.pay_range_min || jobListing.pay_range_max) && (
                        <span className="inline-flex items-center gap-1.5">
                            <Clock className="size-4" />$
                            {jobListing.pay_range_min}&ndash;$
                            {jobListing.pay_range_max}/hr
                        </span>
                    )}
                </div>

                <div className="mt-8 whitespace-pre-line text-foreground">
                    {jobListing.description}
                </div>

                {jobListing.requirements && (
                    <div className="mt-8">
                        <h2 className="text-lg font-semibold text-foreground">
                            Requirements
                        </h2>
                        <div className="mt-2 whitespace-pre-line text-muted-foreground">
                            {jobListing.requirements}
                        </div>
                    </div>
                )}

                <Card className="mt-12" id="apply">
                    <CardHeader>
                        <CardTitle>Apply for this position</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {wasSuccessful ? (
                            <p className="text-sm font-medium text-primary">
                                Application submitted. We will be in touch soon!
                            </p>
                        ) : (
                            <form onSubmit={submit} className="space-y-5">
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="full_name">
                                            Full Name
                                        </Label>
                                        <Input
                                            id="full_name"
                                            value={data.full_name}
                                            onChange={(e) =>
                                                setData(
                                                    'full_name',
                                                    e.target.value,
                                                )
                                            }
                                            required
                                        />
                                        <InputError
                                            message={errors.full_name}
                                        />
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
                                        <Label htmlFor="resume">
                                            Resume (PDF or Word, max 5MB)
                                        </Label>
                                        <Input
                                            id="resume"
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            onChange={(e) =>
                                                setData(
                                                    'resume',
                                                    e.target.files?.[0] ?? null,
                                                )
                                            }
                                            required
                                        />
                                        <InputError message={errors.resume} />
                                    </div>

                                    <div className="grid gap-2 sm:col-span-2">
                                        <Label htmlFor="cover_note">
                                            Note (optional)
                                        </Label>
                                        <Textarea
                                            id="cover_note"
                                            rows={4}
                                            value={data.cover_note}
                                            onChange={(e) =>
                                                setData(
                                                    'cover_note',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <InputError
                                            message={errors.cover_note}
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={processing}
                                    size="lg"
                                >
                                    {processing
                                        ? 'Submitting...'
                                        : 'Submit Application'}
                                </Button>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </section>
        </>
    );
}
