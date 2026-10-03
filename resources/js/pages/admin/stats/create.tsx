import { Head, useForm } from '@inertiajs/react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import {
    StatForm,
    type StatFormData,
} from '@/components/admin/stats/stat-form';
import admin from '@/routes/admin';

export default function StatsCreate() {
    const { data, setData, post, processing, errors } = useForm<StatFormData>({
        label: '',
        value: '',
        icon: '',
        icon_path: null,
        icon_image: null,
        position: 0,
        is_active: true,
    });

    function submit(event: React.FormEvent) {
        event.preventDefault();
        post(admin.stats.store().url, { forceFormData: true });
    }

    return (
        <>
            <Head title="New Stat" />
            <div className="p-4 sm:p-6">
                <AdminPageHeader title="New Stat" />
                <form onSubmit={submit}>
                    <StatForm
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        submitLabel="Create Stat"
                    />
                </form>
            </div>
        </>
    );
}

StatsCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Stats', href: admin.stats.index() },
        { title: 'New', href: admin.stats.create() },
    ],
};
