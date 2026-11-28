<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    protected $guarded = [];

    protected $casts = ['sections' => 'array', 'images' => 'array', 'is_builtin' => 'boolean', 'is_published' => 'boolean', 'is_composite' => 'boolean', 'show_default_content' => 'boolean'];
}
