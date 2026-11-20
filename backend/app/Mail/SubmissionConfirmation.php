<?php

namespace App\Mail;

use App\Models\FormSubmission;
use App\Support\Mailboxes;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

/** Auto-reply to the person who filled in the form, with the reference number. */
class SubmissionConfirmation extends Mailable
{
    public function __construct(public FormSubmission $submission) {}

    public function envelope(): Envelope
    {
        $team = Mailboxes::address($this->submission->mailbox ?? 'info');

        // Replies from the applicant go to the mailbox that handles this form.
        return new Envelope(
            subject: 'We received your '.$this->submission->form.' – '.$this->submission->reference,
            replyTo: $team ? [$team] : [],
        );
    }

    public function content(): Content
    {
        return new Content(view: 'mail.submission-confirmation');
    }
}
