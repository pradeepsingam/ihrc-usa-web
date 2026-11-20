<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FormDefinition extends Model
{
    protected $guarded = [];

    protected $casts = ["intro" => "array", "sections" => "array", "is_published" => "boolean", "is_builtin" => "boolean"];
}
