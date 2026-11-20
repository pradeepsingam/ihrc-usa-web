<?php

namespace App\Mail;

use App\Models\Subscriber;
use App\Support\Mailboxes;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

/** Double opt-in: the subscriber must click the link before receiving newsletters. */
class SubscribeConfirmation extends Mailable
{
    public function __construct(public Subscriber $subscriber) {}

    public function envelope(): Envelope
    {
        return new Envelope(replyTo: array_filter([Mailboxes::address('info')]), subject: 'Please confirm your subscription to IHRC-USA news');
    }

    public function content(): Content
    {
        return new Content(view: 'mail.subscribe-confirmation');
    }
}
