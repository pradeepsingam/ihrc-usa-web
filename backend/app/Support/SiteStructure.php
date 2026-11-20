<?php

namespace App\Support;

/**
 * The fixed structure of the public website (pages, member groups, programs, categories).
 * Exported from the React app by `npm run export-structure` into database/data/site-structure.json.
 */
class SiteStructure
{
    protected static ?array $data = null;

    public static function all(): array
    {
        return static::$data ??= json_decode(file_get_contents(database_path('data/site-structure.json')), true);
    }

    public static function pages(): array
    {
        return static::all()['pages'] ?? [];
    }

    /** ['leadership' => 'Leadership(P5)', ...] */
    public static function groupOptions(): array
    {
        return collect(static::all()['groups'] ?? [])->map(fn ($g) => $g['title'])->all();
    }

    /** Seats of a group: [1 => '1 — President', 2 => '2 — Vice President', ...] */
    public static function seatOptions(?string $group): array
    {
        $roles = $group ? (static::all()["groups"][$group]["roles"] ?? []) : [];
        $out = [];
        foreach ($roles as $i => $role) {
            $out[$i + 1] = ($i + 1).' — '.$role;
        }

        return $out;
    }

    /** Roles used on a Members page, e.g. ['President', 'Vice President', …] (suggestions in the admin). */
    public static function roleOptions(?string $group): array
    {
        return $group ? array_values(array_unique(static::all()['groups'][$group]['roles'] ?? [])) : [];
    }

    public static function role(string $group, int $position): ?string
    {
        return static::all()['groups'][$group]['roles'][$position - 1] ?? null;
    }

    /** ['education-for-children' => '1. Education for Children', ...] */
    public static function programOptions(): array
    {
        return collect(static::all()['programs'] ?? [])->mapWithKeys(fn ($p) => [$p['slug'] => $p['title']])->all();
    }

    public static function programCategories(): array
    {
        return collect(static::all()['programs'] ?? [])->pluck('category')->unique()->mapWithKeys(fn ($c) => [$c => $c])->all();
    }

    public static function publicationCategories(): array
    {
        return collect(static::all()['pubCategories'] ?? [])->mapWithKeys(fn ($c) => [$c => $c])->all();
    }
}
