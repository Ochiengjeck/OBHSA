import { Head, useForm } from '@inertiajs/react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import {
    StatForm,
    type StatFormData,
} from '@/components/admin/stats/stat-form';
import admin from '@/routes/admin';
import type { Stat } from '@/types';

export default function StatsEdit({ stat }: { stat: Stat }) {
    const { data, setData, put, processing, errors } = useForm<StatFormData>({
        label: stat.label,
        value: stat.value,
        icon: stat.icon ?? '',
        position: stat.position,
        is_active: stat.is_active,
    });

    function submit(event: React.FormEvent) {
        event.preventDefault();
        put(admin.stats.update(stat.id).url);
    }

    return (
        <>
            <Head title={`Edit ${stat.label}`} />
            <div className="p-4 sm:p-6">
                <AdminPageHeader title={`Edit: ${stat.label}`} />
                <form onSubmit={submit}>
                    <StatForm
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        submitLabel="Save Changes"
                    />
                </form>
            </div>
        </>
    );
}

StatsEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Stats', href: admin.stats.index() },
    ],
};
