<?php

namespace App\Policies;

use App\Models\User;

/** Membership Officer: the member register and Leadership & People. */
class MemberPolicy extends RolePolicy
{
    protected array $read = [User::MEMBERSHIP_OFFICER];

    protected array $write = [User::MEMBERSHIP_OFFICER];
}
