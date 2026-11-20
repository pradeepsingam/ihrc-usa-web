<?php

namespace App\Policies;

use App\Models\User;

/** Editor: news, events, projects, publications, supporters and other website content. */
class ContentPolicy extends RolePolicy
{
    protected array $read = [User::EDITOR];

    protected array $write = [User::EDITOR];
}
