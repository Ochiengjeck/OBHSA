import { Head, useForm } from '@inertiajs/react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import {
    JobListingForm,
    type JobListingFormData,
} from '@/components/admin/job-listings/job-listing-form';
import { storageUrl } from '@/lib/utils';
import admin from '@/routes/admin';
import type { JobListing } from '@/types';

export default function JobListingsEdit({
    jobListing,
}: {
    jobListing: JobListing;
}) {
    const { data, setData, put, processing, errors } =
        useForm<JobListingFormData>({
            title: jobListing.title,
            specialty: jobListing.specialty,
            employment_type: jobListing.employment_type,
            location_city: jobListing.location_city,
            location_state: jobListing.location_state,
            shift: jobListing.shift ?? '',
            pay_range_min: jobListing.pay_range_min ?? '',
            pay_range_max: jobListing.pay_range_max ?? '',
            description: jobListing.description,
            requirements: jobListing.requirements ?? '',
            image: null,
            is_active: jobListing.is_active,
            closes_at: jobListing.closes_at?.slice(0, 10) ?? '',
        });

    function submit(event: React.FormEvent) {
        event.preventDefault();
        put(admin.jobListings.update(jobListing.id).url, {
            forceFormData: true,
        });
    }

    return (
        <>
            <Head title={`Edit ${jobListing.title}`} />
            <div className="p-4 sm:p-6">
                <AdminPageHeader title={`Edit: ${jobListing.title}`} />
                <form onSubmit={submit}>
                    <JobListingForm
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        imagePreview={storageUrl(jobListing.image_path)}
                        submitLabel="Save Changes"
                    />
                </form>
            </div>
        </>
    );
}

JobListingsEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard() },
        { title: 'Job Listings', href: admin.jobListings.index() },
    ],
};
