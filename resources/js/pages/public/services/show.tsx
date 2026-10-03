import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { PageHead } from '@/components/public/page-head';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { getLucideIcon } from '@/lib/dynamic-icon';
import { storageUrl } from '@/lib/utils';
import { index } from '@/routes/services';
import contact from '@/routes/contact';
import type { Service } from '@/types';

export default function ServiceShow({ service }: { service: Service }) {
    return (
        <>
            <PageHead title={service.title} description={service.summary} />

            <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
                <Button variant="ghost" size="sm" asChild className="-ml-3">
                    <Link href={index()}>
                        <ArrowLeft className="size-4" />
                        All Services
                    </Link>
                </Button>

                {service.image_path ? (
                    <img
                        src={storageUrl(service.image_path) ?? undefined}
                        alt=""
                        className="mt-6 aspect-16/9 w-full rounded-xl object-cover"
                    />
                ) : (
                    <div className="mt-6 flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon
                            iconNode={getLucideIcon(service.icon)}
                            className="size-7"
                        />
                    </div>
                )}

                <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground">
                    {service.title}
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    {service.summary}
                </p>

                {service.description && (
                    <div className="mt-8 whitespace-pre-line text-foreground">
                        {service.description}
                    </div>
                )}

                <Button size="lg" asChild className="mt-10">
                    <Link href={contact.show()}>Get in Touch</Link>
                </Button>
            </section>
        </>
    );
}
