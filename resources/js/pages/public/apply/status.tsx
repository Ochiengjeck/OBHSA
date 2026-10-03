import { Link } from '@inertiajs/react';
import { Clock } from 'lucide-react';
import { PageHead } from '@/components/public/page-head';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { home } from '@/routes';

export default function ApplyStatus({
    statusLabel,
    message,
}: {
    statusLabel: string;
    message: string;
}) {
    return (
        <>
            <PageHead title="Application Status" />

            <section className="mx-auto max-w-md px-4 py-16 sm:px-6 lg:px-8">
                <Card>
                    <CardContent className="flex flex-col items-center gap-4 py-8 text-center">
                        <div className="flex size-16 items-center justify-center rounded-full bg-muted">
                            <Clock className="size-8 text-muted-foreground" />
                        </div>
                        <Badge variant="secondary">{statusLabel}</Badge>
                        <p className="text-muted-foreground">{message}</p>
                        <Button asChild>
                            <Link href={home()}>Return Home</Link>
                        </Button>
                    </CardContent>
                </Card>
            </section>
        </>
    );
}
