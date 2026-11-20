<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\SubscribeConfirmation;
use App\Models\Subscriber;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

/** Newsletter sign-up with double opt-in (requirements 4.6). */
class SubscribeController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        if (filled($request->input('_hp'))) {
            return response()->json(['ok' => true, 'message' => 'Please check your email to confirm your subscription.'], 201);
        }
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
            $s->update(['unsubscribed_at' => null, 'confirmed_at' => null, 'name' => $data['name'] ?? $s->name]);
        } else {
            $s = Subscriber::create(['email' => $email, 'name' => $data['name'] ?? null, 'ip' => $request->ip()]);
        }

        try {
            Mail::to($s->email)->send(new SubscribeConfirmation($s));
        } catch (\Throwable $e) {
            Log::error('Subscription confirmation email could not be sent to '.$s->email.': '.$e->getMessage());

            return response()->json(['ok' => false, 'message' => 'We could not send the confirmation email right now. Please try again later.'], 503);
        }

        return response()->json(['ok' => true, 'message' => 'Please check your email and click the link to confirm your subscription.'], 201);
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
