<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Sends queued emails (newsletters). On shared hosting add one cron entry:
//   * * * * * cd /path/to/backend && php artisan schedule:run >> /dev/null 2>&1
\Illuminate\Support\Facades\Schedule::command('queue:work --stop-when-empty --max-time=50')->everyMinute()->withoutOverlapping();

// Check the email (SMTP) settings: php artisan mail:test you@example.com
Artisan::command('mail:test {to : Address that should receive the test email}', function (string $to) {
    $this->info(\App\Support\MailCheck::describe());
    $error = \App\Support\MailCheck::send($to);
    if ($error) {
        $this->error('Sending failed: '.$error);
        $this->line('Check MAIL_HOST, MAIL_PORT, MAIL_SCHEME, MAIL_USERNAME and MAIL_PASSWORD in .env, then run "php artisan config:clear".');

        return 1;
    }
    $this->info(\App\Support\MailCheck::sentMessage($to));

    return 0;
})->purpose('Send a test email to check the mail settings');

// Set an admin's password from the server (e.g. when locked out): php artisan admin:password you@example.com
Artisan::command('admin:password {email : Email address of the admin account}', function (string $email) {
    $user = \App\Models\User::where('email', $email)->first();
    if (! $user) {
        $this->error("No admin account with the email $email.");
        $this->line('Existing accounts: '.\App\Models\User::pluck('email')->implode(', '));

        return 1;
    }
    $password = $this->secret('New password (at least 10 characters, not shown)');
    if (mb_strlen((string) $password) < 10) {
        $this->error('The password must be at least 10 characters.');

        return 1;
    }
    if ($password !== $this->secret('Type it again')) {
        $this->error('The two passwords do not match.');

        return 1;
    }
    $user->forceFill(['password' => $password])->save();
    \App\Models\ActivityLog::record('password reset (server)', $user);
    $this->info("Password changed for $email. You can sign in now.");

    return 0;
})->purpose("Set an admin user's password");
