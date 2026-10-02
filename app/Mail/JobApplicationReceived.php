<?php

namespace App\Mail;

use App\Models\Application;
use App\Models\JobListing;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class JobApplicationReceived extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Application $application) {}

    public function envelope(): Envelope
    {
        $jobListing = $this->application->jobListing;

        return new Envelope(
            subject: 'New Job Application: '.($jobListing instanceof JobListing ? $jobListing->title : 'General Application'),
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.job-application-received',
            with: ['application' => $this->application],
        );
    }
}
