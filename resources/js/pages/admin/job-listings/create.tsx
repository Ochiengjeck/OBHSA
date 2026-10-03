import { Head, useForm } from '@inertiajs/react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import {
    JobListingForm,
    type JobListingFormData,
} from '@/components/admin/job-listings/job-listing-form';
import admin from '@/routes/admin';

export default function JobListingsCreate() {
    const { data, setData, post, processing, errors } =
        useForm<JobListingFormData>({
            title: '',
            specialty: '',
            employment_type: 'per-diem',
            location_city: '',
            location_state: '',
            shift: '',
            pay_range_min: '',
            pay_range_max: '',
            description: '',
            requirements: '',
            image: null,
            is_active: true,
            closes_at: '',
        });

    function submit(event: React.FormEvent) {
        event.preventDefault();
        post(admin.jobListings.store().url, { forceFormData: true });
    }

    return (
        <>
            <Head title="New Job Listing" />
            <div className="p-4 sm:p-6">
                <AdminPageHeader title="New Job Listing" />
                <form onSubmit={submit}>
                    <JobListingForm
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        submitLabel="Create Listing"
                    />
                </form>
            </div>
        </>
    );
}

JobListingsCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Job Listings', href: admin.jobListings.index() },
        { title: 'New', href: admin.jobListings.create() },
    ],
};
