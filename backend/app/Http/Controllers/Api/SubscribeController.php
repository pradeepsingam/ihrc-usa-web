<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subscriber;
use App\Services\SubscriberWelcome;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/** Save newsletter sign-ups immediately and send a welcome email. */
class SubscribeController extends Controller
{
    public function store(Request $request, SubscriberWelcome $welcome): JsonResponse
    {
        $data = $request->validate([
            'email' => ['required', 'email:rfc', 'max:190'],
            'name' => ['nullable', 'string', 'max:120'],
        ]);
        $email = strtolower(trim($data['email']));
        $s = Subscriber::firstWhere('email', $email);

        if ($s && $s->isActive()) {
            return response()->json(['ok' => false, 'message' => 'This email address is already subscribed.'], 409);
        }
        if ($s) {
            $s->update(['unsubscribed_at' => null, 'confirmed_at' => now(), 'name' => $data['name'] ?? $s->name, 'ip' => $request->ip(), 'welcome_sent_at' => null]);
        } else {
            $s = Subscriber::create(['email' => $email, 'name' => $data['name'] ?? null, 'ip' => $request->ip(), 'confirmed_at' => now()]);
        }

        $sent = $welcome->send($s);

        return response()->json([
            'ok' => true,
            'email_sent' => $sent,
            'message' => $sent
                ? 'You are subscribed to IHRC-USA news and updates. We have sent a welcome email; please check your inbox or spam folder.'
                : 'You are subscribed to IHRC-USA news and updates. Your sign-up is saved, but we could not send the welcome email right now.',
        ], 201);
    }

    public function confirm(string $token)
    {
        $s = Subscriber::where('token', $token)->firstOrFail();
        if (! $s->confirmed_at || $s->unsubscribed_at) {
            $s->update(['confirmed_at' => now(), 'unsubscribed_at' => null]);
        }

        return $this->page('Subscription confirmed', 'Thank you. You will now receive news and updates from IHRC-USA.');
    }

    public function unsubscribe(string $token)
    {
        $s = Subscriber::where('token', $token)->first();
        $s?->update(['unsubscribed_at' => now()]);

        return $this->page('You have been unsubscribed', 'You will not receive any more newsletters from IHRC-USA.');
    }

    protected function page(string $title, string $text)
    {
        return response()->view('public-message', ['title' => $title, 'text' => $text, 'site' => config('app.frontend_url')]);
    }
}
