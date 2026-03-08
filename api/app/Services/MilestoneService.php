<?php

namespace App\Services;

use App\Models\Milestone;
use App\Models\Project;
use Illuminate\Database\Eloquent\Collection;

class MilestoneService
{
    public function list(Project $project, array $filters): Collection
    {
        return $project->milestones()
            ->filterByStatus($filters['status'] ?? null)
            ->withCount([
                'tasks',
                'tasks as tasks_done_count' => fn($q) => $q->where('status', 'done'),
            ])
            ->orderBy('sort_order')
            ->get();
    }

    public function create(Project $project, array $data): Milestone
    {
        return $project->milestones()->create($data)->fresh();
    }

    public function update(Milestone $milestone, array $data): Milestone
    {
        $milestone->update($data);

        return $milestone->fresh();
    }

    public function delete(Milestone $milestone): void
    {
        $milestone->delete();
    }

    public function updateStatus(Milestone $milestone, string $status): Milestone
    {
        $data = ['status' => $status];

        if ($status === 'completed') {
            $data['completed_at'] = now();
        } elseif (in_array($status, ['pending', 'in_progress'])) {
            $data['completed_at'] = null;
        }

        $milestone->update($data);

        return $milestone->fresh();
    }
}
