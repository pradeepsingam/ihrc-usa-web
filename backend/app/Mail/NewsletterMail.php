<?php

namespace App\Mail;

use App\Models\Newsletter;
use App\Models\Subscriber;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use App\Support\Mailboxes;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Headers;

class NewsletterMail extends Mailable implements ShouldQueue
{
    use Queueable;

    public function __construct(public Newsletter $newsletter, public Subscriber $subscriber) {}

    public function envelope(): Envelope
    {
        return new Envelope(replyTo: array_filter([Mailboxes::address('info')]), subject: $this->newsletter->subject);
    }

    public function headers(): Headers
    {
        return new Headers(text: ['List-Unsubscribe' => '<'.route('unsubscribe', $this->subscriber->token).'>']);
    }

    public function content(): Content
    {
        return new Content(view: 'mail.newsletter');
    }
}
