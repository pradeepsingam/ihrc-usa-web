<x-filament-widgets::widget>
    <div style="border:1px solid #f59e0b;background:#fffbeb;color:#78350f;border-radius:12px;padding:14px 16px">
        <strong>Emails are not being sent.</strong>
        The mail setting is <code>MAIL_MAILER={{ config('mail.default') }}</code>, so form emails, confirmation emails to applicants and
        subscribers, password resets and newsletters are only written to the log file. Fill in the SMTP settings in
        <code>backend/.env</code> (see <code>.env.example</code>), run <code>php artisan config:clear</code>, then use
        <em>Administration → Settings → Send test email</em>.
    </div>
</x-filament-widgets::widget>
