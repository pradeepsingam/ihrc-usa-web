<?php

namespace App\Support;

class PublicCopy
{
    public static function clean(mixed $value): mixed
    {
        if (is_array($value)) {
            foreach ($value as $key => $item) {
                if (! in_array($key, ['id', 'slug', 'type', 'kind', 't', 'name', 'mailbox', 'image', 'images', 'photo', 'file', 'logo', 'url', 'website', 'src'], true)) {
                    $value[$key] = self::clean($item);
                }
            }

            return $value;
        }
        if (! is_string($value)) {
            return $value;
        }

        $value = str_ireplace('info@gmail.com', 'info@ihrc-usa.org', $value);
        if (preg_match('#^(?:https?://|/|mailto:)#i', $value)) {
            return $value;
        }

        $parts = preg_split('/(<[^>]+>)/', $value, flags: PREG_SPLIT_DELIM_CAPTURE);
        foreach ($parts as &$part) {
            if (str_starts_with($part, '<')) {
                continue;
            }
            $part = preg_replace_callback('/\b(supporters?|sponsors?|sponsorships?|donations?|donate[ds]?|donating|donors?)\b/i', function (array $match): string {
                $word = strtolower($match[0]);
                $replacement = match ($word) {
                    'supporter', 'sponsor' => 'partner',
                    'supporters', 'sponsors' => 'partners',
                    'sponsorship' => 'partnership',
                    'sponsorships' => 'partnerships',
                    'donation' => 'financial contribution',
                    'donations' => 'financial contributions',
                    'donated' => 'contributed',
                    'donating' => 'contributing',
                    'donor' => 'contributor',
                    'donors' => 'contributors',
                    default => 'contribute',
                };

                return ctype_upper($match[0]) ? strtoupper($replacement) : (ctype_upper($match[0][0]) ? ucfirst($replacement) : $replacement);
            }, $part);
        }

        return implode('', $parts);
    }
}
