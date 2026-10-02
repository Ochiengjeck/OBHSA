@component('mail::message')
# New Job Application

@if ($application->jobListing)
**Position:** {{ $application->jobListing->title }}
@else
**Position:** General Application
@endif

**Name:** {{ $application->candidate->full_name }}
**Email:** {{ $application->candidate->email }}
**Phone:** {{ $application->candidate->phone }}

@if ($application->cover_note)
**Note from applicant:**

{{ $application->cover_note }}
@endif

@component('mail::button', ['url' => route('admin.job-applications.show', $application)])
Review Application
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent
