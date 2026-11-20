<?php

namespace App\Policies;

use App\Models\User;

/**
 * Role permissions (requirements 4.1). Super Admin passes every check (see AppServiceProvider).
 * Each subclass lists which roles may read and which may change its records.
 */
abstract class RolePolicy
{
    /** Roles that may see the list and open records. */
    protected array $read = [];

    /** Roles that may add, edit and delete. */
    protected array $write = [];

    protected function can(User $user, array $roles): bool
    {
        return $user->hasRole(...$roles);
    }

    public function viewAny(User $user): bool
    {
        return $this->can($user, [...$this->read, ...$this->write]);
    }

    public function view(User $user, $record = null): bool
    {
        return $this->viewAny($user);
    }

    public function create(User $user): bool
    {
        return $this->can($user, $this->write);
    }

    public function update(User $user, $record = null): bool
    {
        return $this->can($user, $this->write);
    }

    public function delete(User $user, $record = null): bool
    {
        return $this->can($user, $this->write);
    }

    public function deleteAny(User $user): bool
    {
        return $this->can($user, $this->write);
    }

    public function reorder(User $user): bool
    {
        return $this->can($user, $this->write);
    }

    public function restore(User $user, $record = null): bool
    {
        return false;
    }

    public function forceDelete(User $user, $record = null): bool
    {
        return false;
    }
}
