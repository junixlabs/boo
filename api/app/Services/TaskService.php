<?php

namespace App\Services;

use App\Models\Task;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class TaskService
{
    public function list(User $user, array $filters): LengthAwarePaginator
    {
        return $user->tasks()
            ->with('project')
            ->filterByProject($filters['project_id'] ?? null)
            ->filterByStatus($filters['status'] ?? null)
            ->filterByPriority($filters['priority'] ?? null)
            ->dueBetween($filters['due_date_from'] ?? null, $filters['due_date_to'] ?? null)
            ->orderBy($filters['sort'] ?? 'created_at', $filters['order'] ?? 'desc')
            ->paginate($filters['per_page'] ?? 20);
    }

    public function create(User $user, array $data): Task
    {
        $data['user_id'] = $user->id;
        return Task::create($data)->fresh()->load('project');
    }

    public function update(Task $task, array $data): Task
    {
        $task->update($data);
        return $task->fresh()->load('project');
    }

    public function delete(Task $task): void
    {
        $task->delete();
    }

    public function updateStatus(Task $task, string $status): Task
    {
        $data = ['status' => $status];

        if ($status === 'done') {
            $data['completed_at'] = now();
        } elseif (in_array($status, ['todo', 'in_progress'])) {
            $data['completed_at'] = null;
        }

        $task->update($data);
        return $task->fresh()->load('project');
    }
}
