<?php

namespace App\Support;

use App\Models\Partner;
use App\Models\ProgramDetail;
use App\Models\WebsiteContent;

class ContentCatalog
{
    public static function definitions(): array
    {
        return collect(SiteStructure::all()['websiteContent'] ?? [])->keyBy('key')->all();
    }

    public static function sync(): void
    {
        foreach (static::definitions() as $definition) {
            WebsiteContent::firstOrCreate(['key' => $definition['key']], $definition);
        }
        foreach (SiteStructure::all()['programs'] ?? [] as $index => $program) {
            $record = ProgramDetail::firstOrNew(['slug' => $program['slug']]);
            if (! $record->exists || $record->title === null) {
                foreach (['title', 'number', 'category', 'summary', 'image_url'] as $field) {
                    if ($record->{$field} === null || $record->{$field} === '') {
                        $record->{$field} = $program[$field] ?? null;
                    }
                }
            }
            if (! $record->exists) {
                $record->sort = $index;
                $record->is_published = true;
            }
            $record->save();
        }
        foreach (SiteStructure::all()['partners'] ?? [] as $partner) {
            Partner::firstOrCreate(['name' => $partner['name']], $partner);
        }
    }
}
