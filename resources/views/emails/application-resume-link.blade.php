@component('mail::message')
# {{ $application->candidate->contact_verified_at ? 'Continue Your Application' : 'Verify Your Email' }}

Hi {{ $application->candidate->first_name ?? $application->candidate->full_name }},

@if ($application->candidate->contact_verified_at)
Pick up right where you left off on your OBHSA application.
@else
Thanks for starting your application with OBHSA. Click below to verify your email and continue where you left off.
@endif

@component('mail::button', ['url' => $resumeUrl])
Continue My Application
@endcomponent

This link stays valid for 14 days. If you didn't start an application with OBHSA, you can safely ignore this email.

Thanks,<br>
{{ config('app.name') }}
@endcomponent
