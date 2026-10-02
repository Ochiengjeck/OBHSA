<?php

namespace App\Mail;

use App\Models\Credential;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class CredentialExpiryWarning extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Credential $credential, public string $stage) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->stage === 'overdue'
                ? 'Action Needed: Your '.$this->credential->credential_name.' Has Expired'
                : 'Reminder: Your '.$this->credential->credential_name.' Is Expiring Soon',
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.credential-expiry-warning',
            with: [
                'credential' => $this->credential,
                'stage' => $this->stage,
            ],
        );
    }
}
