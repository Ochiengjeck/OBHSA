import { Link, router } from '@inertiajs/react';
import { MapPin, Clock, Briefcase } from 'lucide-react';
import { PageHead } from '@/components/public/page-head';
import { PaginationLinks } from '@/components/pagination-links';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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
    function updateFilter(key: keyof Filters, value: string) {
        router.get(
            index().url,
            { ...filters, [key]: value === 'all' ? undefined : value },
            { preserveState: true, replace: true },
        );
    }

    return (
        <>
            <PageHead
                title="Open Shifts"
                description="Browse open per-diem RN, LPN, and CNA shifts with OBHSA."
            />

            <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="max-w-2xl">
                    <h1 className="text-4xl font-bold tracking-tight text-foreground">
                        Open Shifts
                    </h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Browse current openings and apply in minutes. New shifts
                        are added regularly.
                    </p>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                    <Select
                        value={filters.specialty ?? 'all'}
                        onValueChange={(value) =>
                            updateFilter('specialty', value)
                        }
                    >
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Specialty" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Specialties</SelectItem>
                            {specialties.map((specialty) => (
                                <SelectItem key={specialty} value={specialty}>
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
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Location" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Locations</SelectItem>
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
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Employment Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="per-diem">Per-Diem</SelectItem>
                            <SelectItem value="prn">PRN</SelectItem>
                            <SelectItem value="full-time">Full-Time</SelectItem>
                            <SelectItem value="part-time">Part-Time</SelectItem>
                            <SelectItem value="contract">Contract</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="mt-8 space-y-4">
                    {listings.data.length === 0 && (
                        <p className="text-muted-foreground">
                            No open shifts match these filters right now. Check
                            back soon.
                        </p>
                    )}

                    {listings.data.map((listing) => (
                        <Link key={listing.id} href={show(listing.slug)}>
                            <Card className="transition-shadow hover:shadow-md">
                                <CardHeader>
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <CardTitle>{listing.title}</CardTitle>
                                        <Badge variant="secondary">
                                            {listing.employment_type}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                        <span className="inline-flex items-center gap-1.5">
                                            <Briefcase className="size-4" />
                                            {listing.specialty}
                                        </span>
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
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                <div className="mt-10">
                    <PaginationLinks links={listings.links} />
                </div>
            </section>
        </>
    );
}
