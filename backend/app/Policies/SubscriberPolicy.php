<?php

namespace App\Policies;

use App\Models\User;

/** Editor manages subscribers and newsletters; Viewer may read. */
class SubscriberPolicy extends RolePolicy
{
    protected array $read = [User::VIEWER];

    protected array $write = [User::EDITOR];
}
