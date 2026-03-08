<?php

namespace App\Services;

use App\Models\SkillCategory;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class SkillCategoryService
{
    public function list(User $user): Collection
    {
        return $user->skillCategories()
            ->with('skills')
            ->withCount('skills')
            ->orderBy('sort_order')
            ->get();
    }

    public function create(User $user, array $data): SkillCategory
    {
        return $user->skillCategories()->create($data)->fresh();
    }

    public function update(SkillCategory $skillCategory, array $data): SkillCategory
    {
        $skillCategory->update($data);
        return $skillCategory->fresh();
    }

    public function delete(SkillCategory $skillCategory): void
    {
        $skillCategory->delete();
    }
}
