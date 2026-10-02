@component('mail::message')
# {{ $stage === 'overdue' ? 'Your Credential Has Expired' : 'Your Credential Is Expiring Soon' }}

Hi {{ $credential->candidate->first_name ?? $credential->candidate->full_name }},

@if ($stage === 'overdue')
Your **{{ $credential->credential_name }}** expired on {{ $credential->expiry_date->format('F j, Y') }}. Please submit a renewed copy as soon as possible to stay in compliance.
@else
Your **{{ $credential->credential_name }}** is set to expire on {{ $credential->expiry_date->format('F j, Y') }}. Please renew it and submit an updated copy before it expires.
@endif

Thanks,<br>
{{ config('app.name') }}
@endcomponent
