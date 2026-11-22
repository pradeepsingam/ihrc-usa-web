<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Subscriber extends Model
{
    protected $guarded = [];

    protected $casts = ['confirmed_at' => 'datetime', 'unsubscribed_at' => 'datetime', 'welcome_sent_at' => 'datetime'];

    protected static function booted(): void
    {
        static::creating(fn (Subscriber $s) => $s->token ??= Str::random(48));
    }

    public function isActive(): bool
    {
        return $this->confirmed_at && ! $this->unsubscribed_at;
    }

    public function scopeActive($q)
    {
        return $q->whereNotNull('confirmed_at')->whereNull('unsubscribed_at');
    }
}
