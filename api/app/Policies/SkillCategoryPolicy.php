<?php

namespace App\Policies;

use App\Models\SkillCategory;
use App\Models\User;

class SkillCategoryPolicy
{
    public function view(User $user, SkillCategory $skillCategory): bool
    {
        return $user->id === $skillCategory->user_id;
    }

    public function update(User $user, SkillCategory $skillCategory): bool
    {
        return $user->id === $skillCategory->user_id;
    }

    public function delete(User $user, SkillCategory $skillCategory): bool
    {
        return $user->id === $skillCategory->user_id;
    }
}
