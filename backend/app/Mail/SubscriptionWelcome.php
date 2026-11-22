<?php

namespace App\Mail;

use App\Models\Subscriber;
use App\Support\Mailboxes;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class SubscriptionWelcome extends Mailable
{
    public function __construct(public Subscriber $subscriber) {}

    public function envelope(): Envelope
    {
        return new Envelope(replyTo: array_filter([Mailboxes::address('info')]), subject: 'You are subscribed to IHRC-USA news');
    }

    public function content(): Content
    {
        return new Content(view: 'mail.subscription-welcome');
    }
}
