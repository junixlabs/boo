<?php

namespace App\Services;

use App\Models\LearningTask;
use App\Models\Skill;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class LearningTaskService
{
    public function list(Skill $skill, array $filters): Collection
    {
        return $skill->learningTasks()
            ->filterByStatus($filters['status'] ?? null)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function create(Skill $skill, User $user, array $data): LearningTask
    {
        return LearningTask::create(array_merge($data, [
            'skill_id' => $skill->id,
            'user_id' => $user->id,
        ]))->fresh();
    }

    public function update(LearningTask $task, array $data): LearningTask
    {
        $task->update($data);
        return $task->fresh();
    }

    public function delete(LearningTask $task): void
    {
        $task->delete();
    }

    public function updateStatus(LearningTask $task, string $status): LearningTask
    {
        $data = ['status' => $status];

        if ($status === 'done') {
            $data['completed_at'] = now();
        } elseif (in_array($status, ['todo', 'in_progress'])) {
            $data['completed_at'] = null;
        }

        $task->update($data);
        return $task->fresh();
    }
}
