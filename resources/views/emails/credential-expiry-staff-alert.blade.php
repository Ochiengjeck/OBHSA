@component('mail::message')
# Credential Compliance Alert

**Employee:** {{ $credential->candidate->full_name }}
**Credential:** {{ $credential->credential_name }}
**Expiry date:** {{ $credential->expiry_date->format('F j, Y') }}
**Stage:** {{ str($stage)->replace('_', ' ')->title() }}

@if ($stage === 'overdue')
This credential has already expired and the employee has been notified.
@else
This credential is approaching expiry and the employee has been notified.
@endif

@component('mail::button', ['url' => route('admin.compliance.index')])
Review Compliance
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent
