@component('mail::message')
# You've Got an Offer!

Hi {{ $offer->application->candidate->first_name ?? $offer->application->candidate->full_name }},

Congratulations! OBHSA would like to offer you the **{{ $offer->position }}** position.

**Pay rate:** ${{ $offer->pay_rate }}/hr
**Employment type:** {{ $offer->employment_type }}
**Start date:** {{ $offer->start_date->format('F j, Y') }}

Please review and respond to this offer below.

@component('mail::button', ['url' => $offerUrl])
Review Your Offer
@endcomponent

@if ($offer->expires_at)
This offer expires {{ $offer->expires_at->format('F j, Y') }}.
@endif

Thanks,<br>
{{ config('app.name') }}
@endcomponent
