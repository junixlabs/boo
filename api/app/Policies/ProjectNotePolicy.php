<?php

namespace App\Policies;

use App\Models\ProjectNote;
use App\Models\User;

class ProjectNotePolicy
{
    public function view(User $user, ProjectNote $projectNote): bool
    {
        return $user->id === $projectNote->user_id;
    }

    public function update(User $user, ProjectNote $projectNote): bool
    {
        return $user->id === $projectNote->user_id;
    }

    public function delete(User $user, ProjectNote $projectNote): bool
    {
        return $user->id === $projectNote->user_id;
    }
}
