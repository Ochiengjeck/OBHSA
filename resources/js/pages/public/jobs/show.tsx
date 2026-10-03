import { Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Briefcase,
    Calendar,
    Clock,
    DollarSign,
    MapPin,
} from 'lucide-react';
import { PageHead } from '@/components/public/page-head';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useStorageUrl } from '@/hooks/use-storage-url';
import applyRoutes from '@/routes/apply';
import { index } from '@/routes/jobs';
import type { JobListing } from '@/types';

export default function JobShow({ jobListing }: { jobListing: JobListing }) {
    const storageUrl = useStorageUrl();
    const hasPayRange = Boolean(
        jobListing.pay_range_min || jobListing.pay_range_max,
    );

    return (
        <>
            <PageHead
                title={jobListing.title}
                description={jobListing.description.slice(0, 160)}
            />

            <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
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
                        className="mt-6 aspect-21/9 w-full rounded-2xl object-cover shadow-md"
                    />
                ) : (
                    <div
                        aria-hidden
                        className="mt-6 flex aspect-21/9 w-full items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-accent/30"
                    >
                        <Briefcase className="size-14 text-primary/40" />
                    </div>
                )}

                <div className="mt-10 grid gap-10 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="secondary">
                                {jobListing.employment_type}
                            </Badge>
                            {jobListing.shift && (
                                <Badge variant="outline">
                                    {jobListing.shift}
                                </Badge>
                            )}
                        </div>

                        <h1 className="mt-4 text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">
                            {jobListing.title}
                        </h1>

                        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                            <span className="inline-flex items-center gap-1.5">
                                <Briefcase className="size-4" />
                                {jobListing.specialty}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <MapPin className="size-4" />
                                {jobListing.location_city},{' '}
                                {jobListing.location_state}
                            </span>
                        </div>

                        <div className="mt-8 space-y-4 text-foreground">
                            {jobListing.description
                                .split(/\n{2,}/)
                                .filter(Boolean)
                                .map((paragraph, index) => (
                                    <p
                                        key={index}
                                        className="leading-relaxed whitespace-pre-line"
                                    >
                                        {paragraph}
                                    </p>
                                ))}
                        </div>

                        {jobListing.requirements && (
                            <div className="mt-10 rounded-2xl border border-border bg-card p-6">
                                <h2 className="text-lg font-semibold text-foreground">
                                    Requirements
                                </h2>
                                <div className="mt-3 leading-relaxed whitespace-pre-line text-muted-foreground">
                                    {jobListing.requirements}
                                </div>
                            </div>
                        )}
                    </div>

                    <aside className="order-first lg:order-none">
                        <div className="space-y-4 lg:sticky lg:top-24">
                            <div
                                className="rounded-2xl border border-primary/20 bg-primary/5 p-6"
                                id="apply"
                            >
                                {hasPayRange && (
                                    <p className="text-2xl font-bold text-foreground">
                                        ${jobListing.pay_range_min}&ndash;$
                                        {jobListing.pay_range_max}
                                        <span className="text-sm font-normal text-muted-foreground">
                                            {' '}
                                            /hr
                                        </span>
                                    </p>
                                )}
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Our application takes about 10 minutes. You
                                    can save your progress and finish later.
                                </p>
                                <Button
                                    asChild
                                    size="lg"
                                    className="mt-5 w-full"
                                >
                                    <Link
                                        href={
                                            applyRoutes.create({
                                                query: {
                                                    job_listing:
                                                        jobListing.slug,
                                                },
                                            }).url
                                        }
                                    >
                                        Start Your Application
                                    </Link>
                                </Button>
                            </div>

                            <div className="rounded-2xl border border-border bg-card p-6">
                                <h2 className="text-sm font-semibold text-foreground">
                                    Shift Details
                                </h2>
                                <dl className="mt-4 space-y-3 text-sm">
                                    <div className="flex items-start gap-2.5">
                                        <Briefcase className="mt-0.5 size-4 shrink-0 text-primary" />
                                        <div>
                                            <dt className="text-muted-foreground">
                                                Specialty
                                            </dt>
                                            <dd className="font-medium text-foreground">
                                                {jobListing.specialty}
                                            </dd>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2.5">
                                        <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                                        <div>
                                            <dt className="text-muted-foreground">
                                                Location
                                            </dt>
                                            <dd className="font-medium text-foreground">
                                                {jobListing.location_city},{' '}
                                                {jobListing.location_state}
                                            </dd>
                                        </div>
                                    </div>
                                    {jobListing.shift && (
                                        <div className="flex items-start gap-2.5">
                                            <Clock className="mt-0.5 size-4 shrink-0 text-primary" />
                                            <div>
                                                <dt className="text-muted-foreground">
                                                    Shift
                                                </dt>
                                                <dd className="font-medium text-foreground">
                                                    {jobListing.shift}
                                                </dd>
                                            </div>
                                        </div>
                                    )}
                                    {hasPayRange && (
                                        <div className="flex items-start gap-2.5">
                                            <DollarSign className="mt-0.5 size-4 shrink-0 text-primary" />
                                            <div>
                                                <dt className="text-muted-foreground">
                                                    Pay Range
                                                </dt>
                                                <dd className="font-medium text-foreground">
                                                    ${jobListing.pay_range_min}
                                                    &ndash;$
                                                    {jobListing.pay_range_max}
                                                    /hr
                                                </dd>
                                            </div>
                                        </div>
                                    )}
                                    {jobListing.closes_at && (
                                        <div className="flex items-start gap-2.5">
                                            <Calendar className="mt-0.5 size-4 shrink-0 text-primary" />
                                            <div>
                                                <dt className="text-muted-foreground">
                                                    Apply By
                                                </dt>
                                                <dd className="font-medium text-foreground">
                                                    {new Date(
                                                        jobListing.closes_at,
                                                    ).toLocaleDateString(
                                                        undefined,
                                                        {
                                                            month: 'long',
                                                            day: 'numeric',
                                                            year: 'numeric',
                                                        },
                                                    )}
                                                </dd>
                                            </div>
                                        </div>
                                    )}
                                </dl>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>
        </>
    );
}
