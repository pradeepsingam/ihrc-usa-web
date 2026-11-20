<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    protected $guarded = [];

    public const UPDATED_AT = null;

    protected $casts = ["changes" => "array", "created_at" => "datetime"];

    public function user(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public static function record(string $action, ?Model $subject = null, ?array $changes = null, ?string $label = null): void
    {
        static::create([
            "user_id" => auth()->id(),
            "action" => $action,
            "subject_type" => $subject ? class_basename($subject) : null,
            "subject_id" => $subject?->getKey(),
            "subject_label" => mb_substr($label ?? (string) ($subject?->reference ?? $subject?->title ?? $subject?->name ?? $subject?->subject ?? $subject?->email ?? $subject?->key ?? ""), 0, 250),
            "changes" => $changes,
        ]);
    }
}
