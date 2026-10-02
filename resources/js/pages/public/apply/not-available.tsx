import { Link } from '@inertiajs/react';
import { MapPinOff } from 'lucide-react';
import { PageHead } from '@/components/public/page-head';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { home } from '@/routes';

export default function ApplyNotAvailable({
    servicedStates,
}: {
    servicedStates: string | null;
}) {
    return (
        <>
            <PageHead title="Not Yet in Your Area" />

            <section className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
                <Card>
                    <CardContent className="flex flex-col items-center gap-4 py-8">
                        <MapPinOff className="size-12 text-muted-foreground" />
                        <h1 className="text-2xl font-bold text-foreground">
                            We don't serve your area yet
                        </h1>
                        <p className="text-muted-foreground">
                            OBHSA currently staffs caregivers in{' '}
                            {servicedStates ?? 'a limited service area'}. We've
                            saved your information and will reach out if that
                            changes.
                        </p>
                        <Button asChild>
                            <Link href={home()}>Return Home</Link>
                        </Button>
                    </CardContent>
                </Card>
            </section>
        </>
    );
}
