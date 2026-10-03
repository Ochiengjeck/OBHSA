import { Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { useStorageUrl } from '@/hooks/use-storage-url';
import { getLucideIcon } from '@/lib/dynamic-icon';
import { show } from '@/routes/services';
import type { Service } from '@/types';

export function ServiceCard({ service }: { service: Service }) {
    const storageUrl = useStorageUrl();

    return (
        <Link href={show(service.slug)}>
            <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
                {service.image_path ? (
                    <img
                        src={storageUrl(service.image_path) ?? undefined}
                        alt=""
                        loading="lazy"
                        className="aspect-16/9 w-full object-cover"
                    />
                ) : (
                    <div
                        aria-hidden
                        className="aspect-16/9 w-full bg-gradient-to-br from-primary/15 to-accent/30"
                    />
                )}
                <CardHeader>
                    <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        {service.icon_path ? (
                            <img
                                src={storageUrl(service.icon_path) ?? undefined}
                                alt=""
                                className="size-6 object-contain"
                            />
                        ) : (
                            <Icon
                                iconNode={getLucideIcon(service.icon)}
                                className="size-6"
                            />
                        )}
                    </div>
                    <CardTitle className="mt-4">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        {service.summary}
                    </p>
                </CardContent>
            </Card>
        </Link>
    );
}
