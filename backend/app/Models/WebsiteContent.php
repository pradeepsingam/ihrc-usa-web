<?php

namespace App\Models;

use Database\Factories\WebsiteContentFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WebsiteContent extends Model
{
    /** @use HasFactory<WebsiteContentFactory> */
    use HasFactory;

    protected $guarded = [];

    protected $casts = ['content' => 'array'];
}
