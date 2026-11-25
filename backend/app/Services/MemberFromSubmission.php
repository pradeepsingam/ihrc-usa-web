<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\FormSubmission;
use App\Models\Member;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

/**
 * Approving a Membership or Volunteer application creates (or updates) a member in the register
 * (requirements 4.4), copying the answers and the photo / ID / CV files.
 */
class MemberFromSubmission
{
    /** Answer label (without its "12. " number) => member field */
    protected const MAP = [
        '/^Full Name/i' => 'name',
        '/^Date of Birth/i' => 'date_of_birth',
        '/^Gender/i' => 'gender',
        '/^Nationality/i' => 'nationality',
        '/^Country/i' => 'country',
        '/^City/i' => 'city',
        '/e-?mail/i' => 'email',
        '/address/i' => 'address',
        '/^(WhatsApp|Mobile)/i' => 'phone',
        '/^Profession/i' => 'profession',
        '/^Organi[sz]ation/i' => 'organization',
        '/^Areas of Interest/i' => 'interests',
        '/^Select Membership Title/i' => 'title',
    ];

    public function approve(FormSubmission $s, ?string $note = null): Member
    {
        return DB::transaction(function () use ($s, $note) {
            $fields = $this->fields($s);
            $member = $s->member ?? ($fields['email'] ?? null ? Member::firstWhere('email', $fields['email']) : null) ?? new Member;

            $member->fill(array_filter($fields, fn ($v) => $v !== null && $v !== '') + [
                'status' => 'Active',
                'joined_at' => $member->joined_at ?? now(),
                'expires_at' => $member->expires_at ?? now()->addYear(),
                'fee_status' => $member->fee_status ?? (preg_match('/^Membership/i', $s->form) ? 'Unpaid' : 'Waived'),
                'submission_id' => $s->id,
            ]);
            $member->name ??= $s->subject ?: 'Applicant '.$s->reference;
            $member->title ??= preg_match('/^Volunteer/i', $s->form) ? 'Volunteer' : 'Member';

            // Files from the application: the photo becomes the (public) profile photo, ID and CV stay private.
            foreach (['photo' => ['photo', 'public'], 'idDoc' => ['id_document', 'local'], 'cv' => ['cv', 'local']] as $key => [$field, $disk]) {
                $file = $s->files[$key] ?? null;
                if ($file && ! $member->$field && Storage::disk('local')->exists($file['path'])) {
                    $target = ($disk === 'public' ? 'members/' : 'members-private/').basename($file['path']);
                    Storage::disk($disk)->put($target, Storage::disk('local')->get($file['path']));
                    $member->$field = $target;
                }
            }
            $member->save();

            $s->update(['status' => 'Approved', 'member_id' => $member->id]);
            $s->setRelation('member', $member);
            $s->addNote('Approved – member '.$member->member_id.' created/updated.'.($note ? ' '.$note : ''));
            ActivityLog::record('approved', $s, ['member' => $member->member_id]);

            return $member;
        });
    }

    public function fields(FormSubmission $s): array
    {
        $out = [];
        $levels = [];
        foreach ($s->data ?? [] as $question => $answer) {
            $q = preg_replace('/^\s*\d+\.\s*/', '', $question);
            if (preg_match('/^(Coordinator|Director|Commissioner) Level/i', $q, $m) && $answer !== '') {
                $levels[] = $answer;

                continue;
            }
            foreach (self::MAP as $pattern => $field) {
                if (! isset($out[$field]) && preg_match($pattern, $q) && trim($answer) !== '') {
                    $out[$field] = mb_substr(trim($answer), 0, $field === 'address' || $field === 'interests' ? 2000 : 190);
                    break;
                }
            }
        }
        if (isset($out['title']) && $levels) {
            $out['title'] .= ' – '.implode(', ', $levels);
        }
        if (isset($out['email']) && ! filter_var($out['email'], FILTER_VALIDATE_EMAIL)) {
            unset($out['email']);
        }
        if (isset($out['date_of_birth'])) {
            try {
                $out['date_of_birth'] = Carbon::parse($out['date_of_birth'])->toDateString();
            } catch (\Throwable) {
                unset($out['date_of_birth']);
            }
        }

        return $out;
    }
}
