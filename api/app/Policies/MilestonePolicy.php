<?php

namespace App\Policies;

use App\Models\Milestone;
use App\Models\User;

class MilestonePolicy
{
    public function view(User $user, Milestone $milestone): bool
    {
        $milestone->loadMissing('project');

        return $user->id === $milestone->project->user_id;
    }

    public function update(User $user, Milestone $milestone): bool
    {
        $milestone->loadMissing('project');

        return $user->id === $milestone->project->user_id;
    }

    public function delete(User $user, Milestone $milestone): bool
    {
        $milestone->loadMissing('project');

        return $user->id === $milestone->project->user_id;
    }
}
