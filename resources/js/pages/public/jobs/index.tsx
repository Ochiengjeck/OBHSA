import { Link, router } from '@inertiajs/react';
import {
    ArrowRight,
    Briefcase,
    Clock,
    MapPin,
    SlidersHorizontal,
    Stethoscope,
    X,
} from 'lucide-react';
import { PageHead } from '@/components/public/page-head';
import { PaginationLinks } from '@/components/pagination-links';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useStorageUrl } from '@/hooks/use-storage-url';
import { index, show } from '@/routes/jobs';
import type { JobListing, Paginated } from '@/types';

type Filters = {
    specialty: string | null;
    employment_type: string | null;
    location_city: string | null;
};

export default function JobsIndex({
    listings,
    filters,
    specialties,
    cities,
}: {
    listings: Paginated<JobListing>;
    filters: Filters;
    specialties: string[];
    cities: string[];
}) {
    const storageUrl = useStorageUrl();
    const hasActiveFilters = Boolean(
        filters.specialty || filters.employment_type || filters.location_city,
    );

    function updateFilter(key: keyof Filters, value: string) {
        router.get(
            index().url,
            { ...filters, [key]: value === 'all' ? undefined : value },
            { preserveState: true, replace: true },
        );
    }

    function clearFilters() {
        router.get(index().url, {}, { preserveState: true, replace: true });
    }

    return (
        <>
            <PageHead
                title="Open Shifts"
                description="Browse open per-diem RN, LPN, and CNA shifts with OBHSA."
            />

            <section className="border-b border-border/60 bg-gradient-to-b from-accent/25 to-background">
                <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        <Stethoscope className="size-3.5" />
                        Now Hiring
                    </div>
                    <h1 className="mt-4 text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">
                        Open Shifts
                    </h1>
                    <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
                        Browse current openings and apply in minutes. New shifts
                        are added regularly &mdash;{' '}
                        <span className="font-medium text-foreground">
                            {listings.total} open{' '}
                            {listings.total === 1 ? 'shift' : 'shifts'}
                        </span>{' '}
                        right now.
                    </p>
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:flex-wrap sm:items-center">
                    <div className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
                        <SlidersHorizontal className="size-4 text-primary" />
                        Filter shifts
                    </div>

                    <div className="flex flex-1 flex-wrap gap-3">
                        <Select
                            value={filters.specialty ?? 'all'}
                            onValueChange={(value) =>
                                updateFilter('specialty', value)
                            }
                        >
                            <SelectTrigger className="w-full sm:w-44">
                                <SelectValue placeholder="Specialty" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    All Specialties
                                </SelectItem>
                                {specialties.map((specialty) => (
                                    <SelectItem
                                        key={specialty}
                                        value={specialty}
                                    >
                                        {specialty}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={filters.location_city ?? 'all'}
                            onValueChange={(value) =>
                                updateFilter('location_city', value)
                            }
                        >
                            <SelectTrigger className="w-full sm:w-44">
                                <SelectValue placeholder="Location" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    All Locations
                                </SelectItem>
                                {cities.map((city) => (
                                    <SelectItem key={city} value={city}>
                                        {city}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={filters.employment_type ?? 'all'}
                            onValueChange={(value) =>
                                updateFilter('employment_type', value)
                            }
                        >
                            <SelectTrigger className="w-full sm:w-44">
                                <SelectValue placeholder="Employment Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="per-diem">
                                    Per-Diem
                                </SelectItem>
                                <SelectItem value="prn">PRN</SelectItem>
                                <SelectItem value="full-time">
                                    Full-Time
                                </SelectItem>
                                <SelectItem value="part-time">
                                    Part-Time
                                </SelectItem>
                                <SelectItem value="contract">
                                    Contract
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearFilters}
                            className="text-muted-foreground"
                        >
                            <X className="size-3.5" />
                            Clear filters
                        </Button>
                    )}
                </div>

                {listings.data.length === 0 ? (
                    <div className="mt-16 flex flex-col items-center rounded-2xl border border-dashed border-border py-16 text-center">
                        <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Briefcase className="size-6" />
                        </div>
                        <h2 className="mt-4 text-lg font-semibold text-foreground">
                            No open shifts match these filters
                        </h2>
                        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                            Try widening your search, or check back soon &mdash;
                            new shifts are posted regularly.
                        </p>
                        {hasActiveFilters && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="mt-6"
                                onClick={clearFilters}
                            >
                                Clear filters
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="mt-10 grid gap-6 sm:grid-cols-2">
                        {listings.data.map((listing) => (
                            <Link
                                key={listing.id}
                                href={show(listing.slug)}
                                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
                            >
                                <div className="relative aspect-video w-full overflow-hidden">
                                    {listing.image_path ? (
                                        <img
                                            src={
                                                storageUrl(
                                                    listing.image_path,
                                                ) ?? undefined
                                            }
                                            alt=""
                                            loading="lazy"
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div
                                            aria-hidden
                                            className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/15 to-accent/30"
                                        >
                                            <Briefcase className="size-10 text-primary/40" />
                                        </div>
                                    )}
                                    <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
                                        <Badge className="border-transparent bg-background/90 text-foreground backdrop-blur">
                                            {listing.specialty}
                                        </Badge>
                                        <Badge
                                            variant="secondary"
                                            className="bg-background/90 backdrop-blur"
                                        >
                                            {listing.employment_type}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="flex flex-1 flex-col p-5">
                                    <h3 className="text-xl font-semibold tracking-tight text-foreground">
                                        {listing.title}
                                    </h3>

                                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
                                        <span className="inline-flex items-center gap-1.5">
                                            <MapPin className="size-4" />
                                            {listing.location_city},{' '}
                                            {listing.location_state}
                                        </span>
                                        {listing.shift && (
                                            <span className="inline-flex items-center gap-1.5">
                                                <Clock className="size-4" />
                                                {listing.shift}
                                            </span>
                                        )}
                                    </div>

                                    {(listing.pay_range_min ||
                                        listing.pay_range_max) && (
                                        <p className="mt-4 inline-flex w-fit items-center rounded-full bg-accent/50 px-3 py-1 text-sm font-semibold text-foreground">
                                            ${listing.pay_range_min}&ndash;$
                                            {listing.pay_range_max}/hr
                                        </p>
                                    )}

                                    <div className="mt-auto flex items-center gap-1.5 pt-5 text-sm font-medium text-primary">
                                        View shift
                                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                <div className="mt-12">
                    <PaginationLinks links={listings.links} />
                </div>
            </section>
        </>
    );
}
