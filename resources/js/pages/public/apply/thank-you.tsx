import { Link } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';
import { PageHead } from '@/components/public/page-head';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { home } from '@/routes';

export default function ApplyThankYou() {
    return (
        <>
            <PageHead title="Application Submitted" />

            <section className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
                <Card>
                    <CardContent className="flex flex-col items-center gap-4 py-8">
                        <CheckCircle2 className="size-12 text-primary" />
                        <h1 className="text-2xl font-bold text-foreground">
                            Application submitted!
                        </h1>
                        <p className="text-muted-foreground">
                            Thank you for applying to OBHSA. Our recruiting team
                            will review your application and reach out soon.
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
