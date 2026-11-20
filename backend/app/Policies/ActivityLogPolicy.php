<?php

namespace App\Policies;

use App\Models\User;

/** Activity log: read-only, Super Admin and Viewer (reports). */
class ActivityLogPolicy extends RolePolicy
{
    protected array $read = [User::SUPER_ADMIN, User::VIEWER];

    protected array $write = [];

    public function delete(User $user, $record = null): bool
    {
        return false; // the log cannot be edited, not even by Super Admin
    }

    public function deleteAny(User $user): bool
    {
        return false;
    }

    public function update(User $user, $record = null): bool
    {
        return false;
    }
}
