<?php

namespace App\Policies;

use App\Models\User;

/** Viewer reads all submissions; Membership Officer reviews applications (status, notes, approve). */
class SubmissionPolicy extends RolePolicy
{
    protected array $read = [User::VIEWER, User::MEMBERSHIP_OFFICER];

    protected array $write = [User::MEMBERSHIP_OFFICER];

    public function create(User $user): bool
    {
        return false; // submissions only come from the website
    }

    public function delete(User $user, $record = null): bool
    {
        return false; // only Super Admin
    }

    public function deleteAny(User $user): bool
    {
        return false;
    }
}
