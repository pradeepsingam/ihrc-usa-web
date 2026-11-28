<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProgramDetail extends Model
{
    protected $guarded = [];

    protected $casts = ['date' => 'date', 'activities' => 'array', 'images' => 'array', 'is_published' => 'boolean', 'number' => 'integer', 'sort' => 'integer'];
}
