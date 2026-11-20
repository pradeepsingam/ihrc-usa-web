<?php

namespace App\Filament\Widgets;

use Filament\Widgets\Widget;

/** Warns admins when emails are not really being sent (forms, confirmations, newsletters). */
class MailStatus extends Widget
{
    protected static ?int $sort = 0;

    protected int|string|array $columnSpan = 'full';

    protected string $view = 'filament.widgets.mail-status';

    public static function canView(): bool
    {
        return in_array(config('mail.default'), ['log', 'array'], true) && auth()->user()?->isSuperAdmin();
    }
}
