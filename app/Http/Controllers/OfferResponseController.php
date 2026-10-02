<?php

namespace App\Http\Controllers;

use App\Http\Requests\RespondToOfferRequest;
use App\Models\Offer;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class OfferResponseController extends Controller
{
    /**
     * Show the accept/decline page for a candidate's emailed offer link.
     */
    public function show(string $token): Response|RedirectResponse
    {
        $offer = $this->resolveOffer($token);

        if ($offer instanceof Response) {
            return $offer;
        }

        if ($offer->status !== 'pending') {
            return to_route('offers.thank-you');
        }

        $offer->load('application.candidate:id,full_name,email');

        return Inertia::render('public/offers/show', [
            'offer' => $offer,
            'token' => $token,
        ]);
    }

    /**
     * Record the candidate's response to the offer.
     */
    public function respond(RespondToOfferRequest $request, string $token): Response|RedirectResponse
    {
        $offer = $this->resolveOffer($token);

        if ($offer instanceof Response) {
            return $offer;
        }

        if ($offer->status !== 'pending') {
            return to_route('offers.thank-you');
        }

        $request->validated('action') === 'accept'
            ? $offer->accept()
            : $offer->decline($request->validated('decline_reason'));

        return to_route('offers.thank-you');
    }

    public function thankYou(): Response
    {
        return Inertia::render('public/offers/thank-you');
    }

    /**
     * Resolve a token to its offer, or a dedicated response describing why
     * it couldn't be — never revealing whether an unknown token ever
     * existed.
     */
    private function resolveOffer(string $token): Offer|Response
    {
        $offer = Offer::query()->where('access_token', hash('sha256', $token))->first();

        if (! $offer) {
            return Inertia::render('public/offers/link-issue', ['reason' => 'invalid']);
        }

        if ($offer->accessTokenHasExpired()) {
            return Inertia::render('public/offers/link-issue', ['reason' => 'expired']);
        }

        return $offer;
    }
}
