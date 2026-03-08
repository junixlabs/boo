<?php

namespace App\Services;

use App\Models\Skill;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class SkillService
{
    public function list(User $user, array $filters): Collection
    {
        return $user->skills()
            ->with('projects')
            ->withCount([
                'learningTasks',
                'learningTasks as learning_tasks_done_count' => fn($q) => $q->where('status', 'done'),
            ])
            ->filterByCategory($filters['category_id'] ?? null)
            ->get();
    }

    public function create(User $user, array $data): Skill
    {
        return $user->skills()->create($data)->fresh();
    }

    public function update(Skill $skill, array $data): Skill
    {
        $skill->update($data);
        return $skill->fresh();
    }

    public function delete(Skill $skill): void
    {
        $skill->delete();
    }

    public function syncProjects(Skill $skill, array $projectIds): Skill
    {
        $skill->projects()->sync($projectIds);
        return $skill->fresh()->load('projects');
    }
}
