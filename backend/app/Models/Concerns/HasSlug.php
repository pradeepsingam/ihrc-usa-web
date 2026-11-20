<?php

namespace App\Models\Concerns;

use Illuminate\Support\Str;

/** Gives the record a unique URL slug from its title (used in the website address, e.g. /news/<slug>). */
trait HasSlug
{
    protected static function bootHasSlug(): void
    {
        static::saving(function ($model) {
            if (blank($model->slug)) {
                $base = Str::slug($model->title) ?: 'item';
                $slug = $base;
                $i = 2;
                while (static::where('slug', $slug)->whereKeyNot($model->getKey())->exists()) {
                    $slug = $base.'-'.$i++;
                }
                $model->slug = $slug;
            }
        });
    }
}
