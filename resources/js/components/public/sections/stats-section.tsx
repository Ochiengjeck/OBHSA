import { Icon } from '@/components/ui/icon';
import { useStorageUrl } from '@/hooks/use-storage-url';
import { getLucideIcon } from '@/lib/dynamic-icon';
import type { StatsSectionContent, Stat } from '@/types';

export function StatsSection({
    content,
    stats,
}: {
    content: StatsSectionContent;
    stats: Stat[];
}) {
    const storageUrl = useStorageUrl();

    if (stats.length === 0) {
        return null;
    }

    return (
        <section className="bg-accent/30 py-16">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <h2 className="text-center text-3xl font-semibold tracking-tight text-foreground">
                    {content.heading}
                </h2>

                <dl className="mt-12 grid grid-cols-2 gap-8 text-center sm:grid-cols-4">
                    {stats.map((stat) => (
                        <div key={stat.id}>
                            {stat.icon_path ? (
                                <img
                                    src={
                                        storageUrl(stat.icon_path) ?? undefined
                                    }
                                    alt=""
                                    className="mx-auto mb-2 size-6 object-contain"
                                />
                            ) : (
                                stat.icon && (
                                    <Icon
                                        iconNode={getLucideIcon(stat.icon)}
                                        className="mx-auto mb-2 size-6 text-primary"
                                    />
                                )
                            )}
                            <dt className="text-3xl font-bold text-primary sm:text-4xl">
                                {stat.value}
                            </dt>
                            <dd className="mt-2 text-sm text-muted-foreground">
                                {stat.label}
                            </dd>
                        </div>
                    ))}
                </dl>
            </div>
        </section>
    );
}
