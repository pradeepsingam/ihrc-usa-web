<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use Concerns\HasSlug;

    public function registrations(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(FormSubmission::class);
    }

    protected $guarded = [];

    protected $casts = ['date' => 'date', 'end_date' => 'date', 'images' => 'array', 'is_published' => 'boolean', 'registration_open' => 'boolean'];
}
