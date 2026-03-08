<?php

namespace App\Services;

use App\Models\Idea;
use App\Models\Task;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class IdeaService
{
    public function list(User $user, array $filters): LengthAwarePaginator
    {
        return $user->ideas()
            ->filterByStatus($filters['status'] ?? null)
            ->filterByCategory($filters['category'] ?? null)
            ->orderBy($filters['sort'] ?? 'created_at', $filters['order'] ?? 'desc')
            ->paginate($filters['per_page'] ?? 20);
    }

    public function create(User $user, array $data): Idea
    {
        return $user->ideas()->create($data)->fresh();
    }

    public function update(Idea $idea, array $data): Idea
    {
        $idea->update($data);
        return $idea->fresh();
    }

    public function delete(Idea $idea): void
    {
        $idea->delete();
    }

    public function convert(User $user, Idea $idea, array $data): array
    {
        if ($data['convert_to'] === 'project') {
            $created = $user->projects()->create([
                'title' => $idea->title,
                'description' => $idea->description,
                'type' => 'experiment',
                'status' => 'active',
            ])->fresh();
        } else {
            $created = Task::create([
                'user_id' => $user->id,
                'project_id' => $data['project_id'] ?? null,
                'title' => $idea->title,
                'description' => $idea->description,
                'status' => 'todo',
                'priority' => 'medium',
            ])->fresh()->load('project');
        }

        $idea->update([
            'status' => 'converted',
            'converted_to_type' => $data['convert_to'],
            'converted_to_id' => $created->id,
        ]);

        return ['idea' => $idea->fresh(), 'created' => $created];
    }

    public function discard(Idea $idea): Idea
    {
        $idea->update(['status' => 'discarded']);
        return $idea->fresh();
    }
}
