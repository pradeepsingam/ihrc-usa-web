<?php

namespace App\Support;

use Illuminate\Support\Facades\Mail;

/** Sends a short test email so admins can check the SMTP settings. */
class MailCheck
{
    /** Returns null when the email was handed to the mail server, or the error message. */
    public static function send(string $to): ?string
    {
        try {
            Mail::raw(
                "This is a test email from the IHRC-USA website backend.\n\nIf you can read this, email sending works: website forms, confirmations, password reset and newsletters can be delivered.\n\nSent ".now()->format('d M Y H:i').' via '.config('mail.default').(config('mail.default') === 'smtp' ? ' ('.config('mail.mailers.smtp.host').':'.config('mail.mailers.smtp.port').')' : '').'.',
                fn ($m) => $m->to($to)->subject('IHRC-USA test email'),
            );

            return null;
        } catch (\Throwable $e) {
            return $e->getMessage();
        }
    }

    public static function sentMessage(string $to): string
    {
        return config('mail.default') === 'log'
            ? "Test email written to storage/logs/laravel.log (not sent: MAIL_MAILER=log)."
            : "Test email sent to $to. Check the inbox (and the spam folder).";
    }

    public static function describe(): string
    {
        $m = config('mail.default');
        if ($m === 'log') {
            return 'Emails are only written to the log file (MAIL_MAILER=log) – nothing is really sent.';
        }

        return 'Sending through '.$m.($m === 'smtp' ? ' '.config('mail.mailers.smtp.host').':'.config('mail.mailers.smtp.port') : '').' as '.config('mail.from.address').'.';
    }
}
