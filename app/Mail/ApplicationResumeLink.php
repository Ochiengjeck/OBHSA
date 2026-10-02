<?php

namespace App\Mail;

use App\Models\Application;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ApplicationResumeLink extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Application $application, public string $plaintextToken) {}

    public function envelope(): Envelope
    {
        $verified = $this->application->candidate->contact_verified_at !== null;

        return new Envelope(
            subject: $verified ? 'Continue Your OBHSA Application' : 'Verify Your Email & Continue Your OBHSA Application',
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.application-resume-link',
            with: [
                'application' => $this->application,
                'resumeUrl' => route('apply.resume', $this->plaintextToken),
            ],
        );
    }
}
