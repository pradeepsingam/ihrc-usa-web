<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class News extends Model
{
    use Concerns\HasSlug;

    protected $guarded = [];

    protected $table = 'news';

    protected $casts = ['date' => 'date', 'is_published' => 'boolean'];
}
