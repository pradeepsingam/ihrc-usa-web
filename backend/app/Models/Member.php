<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * The member register. Members with "show on public site" and a page + seat
 * also appear on the website's Members pages (Leadership, Ambassadors…).
 */
class Member extends Model
{
    public const STATUSES = ['Pending' => 'Pending', 'Active' => 'Active', 'Suspended' => 'Suspended', 'Expired' => 'Expired', 'Rejected' => 'Rejected'];

    public const FEE_STATUSES = ['Paid' => 'Paid', 'Unpaid' => 'Unpaid', 'Waived' => 'Waived'];

    public const TITLES = ['Member', 'Volunteer', 'Researcher', 'Ambassador', 'Commissioner', 'High Commissioner', 'Director', 'Coordinator', 'Human Rights Officer', 'Board Member', 'Advisory Council Member', 'Honorary Member', 'Community Partner'];

    protected $guarded = [];

    protected $casts = [
        'date_of_birth' => 'date', 'joined_at' => 'date', 'expires_at' => 'date',
        'photo_public' => 'boolean', 'show_on_site' => 'boolean',
    ];

    protected static function booted(): void
    {
        static::created(function (Member $m) {
            if (! $m->member_id) {
                $m->forceFill(['member_id' => static::formatId($m->id)])->saveQuietly();
            }
        });
    }

    public static function formatId(int $id): string
    {
        return 'IHRC-M-'.str_pad((string) $id, 5, '0', STR_PAD_LEFT);
    }
}
