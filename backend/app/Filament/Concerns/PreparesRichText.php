<?php

namespace App\Filament\Concerns;

use App\Filament\Support\Fields;

/** Turns older plain-text / list content into HTML before it is loaded into the rich text editor. */
trait PreparesRichText
{
    protected function mutateFormDataBeforeFill(array $data): array
    {
        if (array_key_exists('body', $data)) {
            $data['body'] = Fields::textToHtml($data['body']);
        }
        if (isset($data['sections']) && is_array($data['sections'])) {
            $data['sections'] = array_map(fn ($s) => is_array($s) && array_key_exists('body', $s) ? ['body' => Fields::textToHtml($s['body'])] + $s : $s, $data['sections']);
        }

        return $data;
    }
}
