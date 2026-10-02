<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreOfferRequest;
use App\Http\Requests\Admin\UpdateOfferRequest;
use App\Mail\OfferLetter;
use App\Models\Application;
use App\Models\Offer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class OfferController extends Controller
{
    /**
     * Extend a new offer to an application, emailing the candidate a
     * self-service accept/decline link.
     */
    public function store(StoreOfferRequest $request, Application $application): RedirectResponse
    {
        $offer = $application->offers()->create([
            ...$request->validated(),
            'extended_by' => $request->user()->id,
            'extended_at' => now(),
        ]);

        $plaintext = $offer->issueAccessToken();

        Mail::to($application->candidate->email)->queue(new OfferLetter($offer, $plaintext));

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Offer sent.')]);

        return to_route('admin.candidates.show', $application->candidate_id);
    }

    /**
     * Staff override: record the candidate's response manually (e.g. a
     * verbal or phone acceptance), or withdraw the offer.
     */
    public function update(UpdateOfferRequest $request, Offer $offer): RedirectResponse
    {
        match ($request->validated('status')) {
            'accepted' => $offer->accept(),
            'declined' => $offer->decline($request->validated('decline_reason')),
            default => $offer->withdraw(),
        };

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Offer updated.')]);

        return to_route('admin.candidates.show', $offer->application->candidate_id);
    }
}
