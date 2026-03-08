<?php

namespace App\Policies;

use App\Models\FocusArea;
use App\Models\User;

class FocusAreaPolicy
{
    public function view(User $user, FocusArea $focusArea): bool
    {
        return $user->id === $focusArea->user_id;
    }

    public function update(User $user, FocusArea $focusArea): bool
    {
        return $user->id === $focusArea->user_id;
    }

    public function delete(User $user, FocusArea $focusArea): bool
    {
        return $user->id === $focusArea->user_id;
    }
}
