<?php

namespace App\Services;

use App\Models\Project;
use App\Models\ProjectNote;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ProjectNoteService
{
    public function list(Project $project, array $filters): LengthAwarePaginator
    {
        return $project->notes()
            ->orderBy($filters['sort'] ?? 'created_at', $filters['order'] ?? 'desc')
            ->paginate($filters['per_page'] ?? 20);
    }

    public function create(Project $project, User $user, array $data): ProjectNote
    {
        $data['project_id'] = $project->id;
        $data['user_id'] = $user->id;

        return ProjectNote::create($data)->fresh();
    }

    public function update(ProjectNote $projectNote, array $data): ProjectNote
    {
        $projectNote->update($data);

        return $projectNote->fresh();
    }

    public function delete(ProjectNote $projectNote): void
    {
        $projectNote->delete();
    }
}
