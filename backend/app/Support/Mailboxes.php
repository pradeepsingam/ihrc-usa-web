<?php

namespace App\Support;

use App\Models\FormDefinition;
use App\Models\Setting;

/**
 * Which mailbox receives which website form (requirements 3.2).
 * Addresses are edited in Admin → Site settings ("Mailbox – …"). The website never chooses the
 * mailbox: the backend picks it from the form name using this list.
 */
class Mailboxes
{
    /** Default domain for the mailbox addresses (membership@ihrc-usa.org, …). Editable in Settings. */
    public const DOMAIN = 'ihrc-usa.org';

    /** settings key suffix => label */
    public const BOXES = [
        'info' => 'Info (Contact / Website enquiry)',
        'membership' => 'Membership',
        'volunteer' => 'Volunteer',
        'research' => 'Research',
        'event' => 'Event',
        'award' => 'Award',
        'complaints' => 'Complaints',
        'partnership' => 'Partnership',
        'official' => 'Official (Donations, Sponsors)',
        'accreditation' => 'Accreditation',
        'news' => 'News / media',
        'secretary' => 'Secretary',
        'chairman' => 'Chairman',
    ];

    /** Form name prefix (case-insensitive) => mailbox */
    public const ROUTES = [
        'Membership' => 'membership',
        'Volunteer' => 'volunteer',
        'Research' => 'research',
        'Event Registration' => 'event',
        'Award' => 'award',
        'Complaint' => 'complaints',
        'CSO Partnership' => 'partnership',
        'Partnership' => 'partnership',
        'Donation' => 'official',
        'Sponsor' => 'official',
        'IHRC-USA Website Enquiry' => 'info',
        'Contact' => 'info',
        'IHRC-USA Accreditation' => 'accreditation',
        'Accreditation' => 'accreditation',
        'News' => 'news',
        'Media' => 'news',
    ];

    public static function options(): array
    {
        return self::BOXES;
    }

    public static function keyFor(string $form): string
    {
        $def = FormDefinition::where('name', $form)->value('mailbox');
        if ($def && isset(self::BOXES[$def])) {
            return $def;
        }
        foreach (self::ROUTES as $prefix => $box) {
            if (stripos($form, $prefix) === 0) {
                return $box;
            }
        }

        return 'info';
    }

    /** The address for a mailbox, falling back to the Info mailbox and then the site contact email. */
    public static function address(string $key): ?string
    {
        $settings = Setting::whereIn('key', ['mailbox.'.$key, 'mailbox.info', 'email'])->pluck('value', 'key');
        foreach (['mailbox.'.$key, 'mailbox.info', 'email'] as $k) {
            $v = trim((string) ($settings[$k] ?? ''));
            if (filter_var($v, FILTER_VALIDATE_EMAIL)) {
                return $v;
            }
        }

        return null;
    }
}
