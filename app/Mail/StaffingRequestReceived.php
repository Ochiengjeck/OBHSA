<?php

namespace App\Mail;

use App\Models\StaffingRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class StaffingRequestReceived extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public StaffingRequest $staffingRequest) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'New Staffing Request: '.$this->staffingRequest->facility_name,
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.staffing-request-received',
            with: ['staffingRequest' => $this->staffingRequest],
        );
    }
}
