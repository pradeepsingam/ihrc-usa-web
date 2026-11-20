<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use Concerns\HasSlug;

    protected $guarded = [];

    protected $casts = ['date' => 'date', 'images' => 'array', 'is_published' => 'boolean'];
}
