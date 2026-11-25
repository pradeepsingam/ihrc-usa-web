<?php

namespace Database\Seeders;

use App\Models\FormDefinition;
use App\Models\Page;
use App\Models\Setting;
use App\Models\User;
use App\Services\FormSpec;
use App\Support\Mailboxes;
use App\Support\SiteStructure;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /** Settings shown in the admin "Site Settings" screen. key => label */
    public const SETTINGS = [
        'email' => 'Contact email',
        'phone' => 'Phone',
        'address' => 'Address',
        'whatsappLink' => 'WhatsApp chat link',
        'whatsappChannel' => 'WhatsApp channel link',
        'mapUrl' => 'Google Maps embed URL',
        'social.facebook' => 'Facebook URL',
        'social.instagram' => 'Instagram URL',
        'social.youtube' => 'YouTube URL',
        'social.tiktok' => 'TikTok URL',
        'social.twitter' => 'X / Twitter URL',
        'social.linkedin' => 'LinkedIn URL',
        'paymentUrl' => 'Online payment link (Membership / Pay Online buttons)',
    ];

    public function run(): void
    {
        // Site settings: keep existing values, only add missing keys.
        $current = SiteStructure::all()['siteInfo'] ?? [];
        $sort = 0;
        $settings = self::SETTINGS;
        foreach (Mailboxes::BOXES as $box => $label) {
            $settings['mailbox.'.$box] = 'Mailbox – '.$label;
        }
        foreach ($settings as $key => $label) {
            Setting::firstOrCreate(['key' => $key], [
                'label' => $label,
                'value' => str_starts_with($key, 'mailbox.') ? substr($key, 8).'@'.Mailboxes::DOMAIN : (data_get($current, $key) ?: null),
                'sort' => $sort++,
            ]);
        }

        // Text pages (Who We Are, Chairman's Message, policies…): seed with the current website text.
        foreach (SiteStructure::pages() as $slug => $page) {
            Page::firstOrCreate(['slug' => $slug], $page + ['is_builtin' => true]);
        }

        // Forms that the website builds with RegistrationForm: editable in the Form Builder.
        foreach (SiteStructure::all()['forms'] ?? [] as $slug => $f) {
            FormDefinition::firstOrCreate(['slug' => $slug], [
                'name' => $f['name'],
                'title' => $f['title'],
                'intro' => $f['intro'] ?? [],
                'sections' => FormSpec::toBuilderSections($f['sections'] ?? []),
                'mailbox' => Mailboxes::keyFor($f['name']),
                'is_builtin' => true,
            ]);
        }

        // First administrator (change the password after the first login!).
        if (! User::query()->exists()) {
            User::create([
                'name' => 'Administrator',
                'email' => env('ADMIN_EMAIL', 'admin@example.com'),
                'password' => env('ADMIN_PASSWORD', 'change-me-now'),
                'role' => User::SUPER_ADMIN,
            ]);
        }
    }
}
