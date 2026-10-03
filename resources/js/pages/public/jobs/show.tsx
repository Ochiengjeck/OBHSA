import { Link } from '@inertiajs/react';
import { ArrowLeft, Briefcase, Clock, MapPin } from 'lucide-react';
import { PageHead } from '@/components/public/page-head';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { storageUrl } from '@/lib/utils';
import applyRoutes from '@/routes/apply';
import { index } from '@/routes/jobs';
import type { JobListing } from '@/types';

export default function JobShow({ jobListing }: { jobListing: JobListing }) {
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

                {jobListing.image_path ? (
                    <img
                        src={storageUrl(jobListing.image_path) ?? undefined}
                        alt=""
                        className="mt-6 aspect-16/9 w-full rounded-xl object-cover"
                    />
                ) : (
                    <div
                        aria-hidden
                        className="mt-6 flex aspect-16/9 w-full items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-accent/30"
                    >
                        <Briefcase className="size-12 text-primary/40" />
                    </div>
                )}

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
                        <p className="mb-5 text-sm text-muted-foreground">
                            Our application takes about 10 minutes. You can save
                            your progress and finish later.
                        </p>
                        <Button asChild size="lg">
                            <Link
                                href={
                                    applyRoutes.create({
                                        query: { job_listing: jobListing.slug },
                                    }).url
                                }
                            >
                                Start Your Application
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </section>
        </>
    );
}
