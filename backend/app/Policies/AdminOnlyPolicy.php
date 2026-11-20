<?php

namespace App\Policies;

use App\Models\User;

/** Super Admin only: settings, admin users, Form Builder. */
class AdminOnlyPolicy extends RolePolicy
{
    protected array $read = [];

    protected array $write = [];
}
