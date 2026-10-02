@component('mail::message')
# Complete Your Assessment

Hi {{ $attempt->application->candidate->first_name ?? $attempt->application->candidate->full_name }},

As part of your application with OBHSA, please complete the following assessment: **{{ $attempt->assessment->name }}**.

@component('mail::button', ['url' => $assessmentUrl])
Start Assessment
@endcomponent

This link stays valid for 14 days.

Thanks,<br>
{{ config('app.name') }}
@endcomponent
