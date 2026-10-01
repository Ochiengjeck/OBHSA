import { Head } from '@inertiajs/react';

export function PageHead({
    title,
    description,
}: {
    title: string;
    description?: string | null;
}) {
    return (
        <Head title={title}>
            {description && <meta name="description" content={description} />}
        </Head>
    );
}
