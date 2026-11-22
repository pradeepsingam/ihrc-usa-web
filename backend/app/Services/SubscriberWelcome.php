<?php

namespace App\Services;

use App\Mail\SubscriptionWelcome;
use App\Models\Subscriber;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SubscriberWelcome
{
    public function send(Subscriber $subscriber): bool
    {
        try {
            if (in_array(config('mail.default'), ['log', 'array', 'null'], true) && ! app()->runningUnitTests()) {
                throw new \RuntimeException('An email delivery transport has not been configured.');
            }

            Mail::to($subscriber->email)->send(new SubscriptionWelcome($subscriber));
            $subscriber->update(['welcome_sent_at' => now(), 'welcome_error' => null]);

            return true;
        } catch (\Throwable $exception) {
            Log::error('Subscriber welcome email failed.', ['subscriber_id' => $subscriber->id, 'error' => $exception->getMessage()]);
            $subscriber->update(['welcome_error' => 'The welcome email could not be sent. Check the mail settings, then resend.']);

            return false;
        }
    }
}
