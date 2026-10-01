@component('mail::message')
# New Staffing Request

**Facility:** {{ $staffingRequest->facility_name }}
**Facility Type:** {{ $staffingRequest->facility_type ?? 'Not specified' }}
**Contact:** {{ $staffingRequest->contact_name }}
**Email:** {{ $staffingRequest->email }}
**Phone:** {{ $staffingRequest->phone }}

@if ($staffingRequest->staffing_needs)
**Staffing Needs:**

{{ $staffingRequest->staffing_needs }}
@endif

@component('mail::button', ['url' => route('admin.staffing-requests.show', $staffingRequest)])
Review Request
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent
