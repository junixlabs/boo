<?php

namespace App\Policies;

use App\Models\Idea;
use App\Models\User;

class IdeaPolicy
{
    public function view(User $user, Idea $idea): bool
    {
        return $user->id === $idea->user_id;
    }

    public function update(User $user, Idea $idea): bool
    {
        return $user->id === $idea->user_id;
    }

    public function delete(User $user, Idea $idea): bool
    {
        return $user->id === $idea->user_id;
    }
}
