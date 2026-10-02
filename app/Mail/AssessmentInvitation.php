<?php

namespace App\Mail;

use App\Models\AssessmentAttempt;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AssessmentInvitation extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public AssessmentAttempt $attempt, public string $plaintextToken) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Complete Your '.$this->attempt->assessment->name.' Assessment',
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.assessment-invitation',
            with: [
                'attempt' => $this->attempt,
                'assessmentUrl' => route('assessments.show', $this->plaintextToken),
            ],
        );
    }
}
