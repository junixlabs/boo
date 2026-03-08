<?php

namespace App\Policies;

use App\Models\LearningTask;
use App\Models\User;

class LearningTaskPolicy
{
    public function view(User $user, LearningTask $learningTask): bool
    {
        return $user->id === $learningTask->user_id;
    }

    public function update(User $user, LearningTask $learningTask): bool
    {
        return $user->id === $learningTask->user_id;
    }

    public function delete(User $user, LearningTask $learningTask): bool
    {
        return $user->id === $learningTask->user_id;
    }
}
