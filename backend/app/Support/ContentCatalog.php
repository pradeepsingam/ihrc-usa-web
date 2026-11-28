<?php

namespace App\Support;

use App\Models\FormDefinition;
use App\Models\Page;
use App\Models\Partner;
use App\Models\ProgramDetail;
use App\Models\WebsiteContent;
use App\Services\FormSpec;
use Illuminate\Support\Facades\Schema;

class ContentCatalog
{
    public static function definitions(): array
    {
        return collect(SiteStructure::all()['websiteContent'] ?? [])->keyBy('key')->all();
    }

    public static function sync(): void
    {
        foreach (static::definitions() as $definition) {
            $entry = WebsiteContent::firstOrCreate(['key' => $definition['key']], $definition);
            if (str_starts_with($definition['key'], 'copy.')) {
                $entry->update(['content' => ['value' => array_replace($definition['content']['value'], $entry->content['value'] ?? [])]]);
            }
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
        foreach (SiteStructure::pages() as $slug => $page) {
            if (! empty($page['is_composite']) && ! Schema::hasColumn('pages', 'is_composite')) {
                continue;
            }
            if (! empty($page['is_composite']) && ! Page::where('slug', $slug)->exists()) {
                foreach (static::definitions() as $definition) {
                    if (! str_starts_with($definition['key'], 'copy.')) {
                        continue;
                    }
                    foreach ($definition['content']['value'] as $key => $default) {
                        $field = str_starts_with($key, 'page-title-') ? 'title' : (str_starts_with($key, 'page-introduction-') ? 'subtitle' : null);
                        if ($field && $default !== '' && $default === ($page[$field] ?? null)) {
                            $stored = WebsiteContent::where('key', $definition['key'])->first();
                            $page[$field] = $stored?->content['value'][$key] ?? $default;
                        }
                    }
                }
            }
            Page::firstOrCreate(['slug' => $slug], $page + ['is_builtin' => true]);
        }
        foreach (SiteStructure::all()['forms'] ?? [] as $slug => $form) {
            FormDefinition::firstOrCreate(['slug' => $slug], [
                'name' => $form['name'], 'title' => $form['title'],
                'intro' => $form['intro'] ?? [], 'success_message' => $form['successMessage'] ?? null,
                'sections' => FormSpec::toBuilderSections($form['sections'] ?? []),
                'mailbox' => $form['mailbox'] ?? Mailboxes::keyFor($form['name']), 'is_builtin' => true,
            ]);
        }
        foreach (SiteStructure::all()['partners'] ?? [] as $partner) {
            Partner::firstOrCreate(['name' => $partner['name']], $partner);
        }
    }
}
