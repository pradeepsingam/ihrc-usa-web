<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FormSubmission extends Model
{
    public const STATUSES = ['New' => 'New', 'In review' => 'In review', 'Approved' => 'Approved', 'Rejected' => 'Rejected'];

    protected $guarded = [];

    protected $casts = [
        'data' => 'array', 'files' => 'array', 'submitted_at' => 'datetime', 'read_at' => 'datetime',
        'mailed_at' => 'datetime', 'confirmation_sent_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        // Unique reference number, e.g. IHRC-2026-000123
        static::created(function (FormSubmission $s) {
            if (! $s->reference) {
                $s->forceFill(['reference' => 'IHRC-'.($s->submitted_at ?? now())->format('Y').'-'.str_pad((string) $s->id, 6, '0', STR_PAD_LEFT)])->saveQuietly();
            }
        });
    }

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    public function member(): BelongsTo
    {
        return $this->belongsTo(Member::class);
    }

    /** Membership and volunteer applications become members when approved. */
    public function createsMember(): bool
    {
        return (bool) preg_match('/^(Membership|Volunteer)/i', $this->form);
    }

    public function addNote(string $text): void
    {
        $line = '['.now()->format('Y-m-d H:i').' · '.(auth()->user()->name ?? 'System').'] '.trim($text);
        $this->update(['notes' => trim(($this->notes ? $this->notes."\n\n" : '').$line)]);
    }
}
