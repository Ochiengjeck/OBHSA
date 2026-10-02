<?php

namespace App\Mail;

use App\Models\Offer;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OfferLetter extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Offer $offer, public string $plaintextToken) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your OBHSA Job Offer — '.$this->offer->position,
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.offer-letter',
            with: [
                'offer' => $this->offer,
                'offerUrl' => route('offers.show', $this->plaintextToken),
            ],
        );
    }
}
