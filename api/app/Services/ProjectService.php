<?php

namespace App\Services;

use App\Models\Project;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ProjectService
{
    public function list(User $user, array $filters): LengthAwarePaginator
    {
        return $user->projects()
            ->filterByStatus($filters['status'] ?? null)
            ->filterByType($filters['type'] ?? null)
            ->withCount(['tasks', 'tasks as tasks_done_count' => fn($q) => $q->where('status', 'done')])
            ->orderBy($filters['sort'] ?? 'priority', $filters['order'] ?? 'asc')
            ->paginate($filters['per_page'] ?? 20);
    }

    public function create(User $user, array $data): Project
    {
        return $user->projects()->create($data)->fresh();
    }

    public function show(Project $project): Project
    {
        $project->loadCount([
            'tasks',
            'tasks as tasks_done_count' => fn($q) => $q->where('status', 'done'),
            'milestones',
            'milestones as milestones_done_count' => fn($q) => $q->where('status', 'completed'),
        ]);
        return $project;
    }

    public function update(Project $project, array $data): Project
    {
        $project->update($data);
        return $project->fresh();
    }

    public function delete(Project $project): void
    {
        $project->delete();
    }

    public function updateStatus(Project $project, string $status): Project
    {
        $project->update(['status' => $status]);
        return $project->fresh();
    }
}
