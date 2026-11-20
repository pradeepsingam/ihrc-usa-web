<?php

namespace App\Mail;

use App\Models\FormSubmission;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

/** Sent to the form's mailbox with all the answers (requirements 3.3 "Send to mailbox"). */
class SubmissionReceived extends Mailable
{
    public function __construct(public FormSubmission $submission) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '['.$this->submission->reference.'] '.($this->submission->subject ?: $this->submission->form),
            replyTo: $this->submission->applicant_email ? [$this->submission->applicant_email] : [],
        );
    }

    public function content(): Content
    {
        return new Content(view: 'mail.submission-received');
    }
}
