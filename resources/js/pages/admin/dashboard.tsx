import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import admin from '@/routes/admin';

type Counts = {
    newApplications: number;
    newLeads: number;
    activeJobListings: number;
    publishedPosts: number;
};

export default function Dashboard({ counts }: { counts: Counts }) {
    const cards = [
        {
            label: 'New Applications',
            value: counts.newApplications,
            href: admin.jobApplications.index(),
        },
        {
            label: 'New Staffing Leads',
            value: counts.newLeads,
            href: admin.staffingRequests.index(),
        },
        {
            label: 'Active Job Listings',
            value: counts.activeJobListings,
            href: admin.jobListings.index(),
        },
        {
            label: 'Published Posts',
            value: counts.publishedPosts,
            href: admin.blogPosts.index(),
        },
    ];

    return (
        <>
            <Head title="Dashboard" />
            <div className="p-4 sm:p-6">
                <h1 className="text-xl font-semibold tracking-tight">
                    Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">
                    Overview of OBHSA backoffice activity.
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {cards.map((card) => (
                        <Link key={card.label} href={card.href}>
                            <Card className="transition-shadow hover:shadow-md">
                                <CardHeader>
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        {card.label}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-3xl font-bold text-foreground">
                                        {card.value}
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: admin.dashboard() }],
};
