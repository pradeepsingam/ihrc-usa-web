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
