<?php

namespace App\Services;

use App\Models\Goal;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class GoalService
{
    public function list(User $user, array $filters): Collection
    {
        return $user->goals()
            ->filterByTimeframe($filters['timeframe'] ?? null)
            ->filterByStatus($filters['status'] ?? null)
            ->orderBy('sort_order', 'asc')
            ->get();
    }

    public function create(User $user, array $data): Goal
    {
        return $user->goals()->create($data)->fresh();
    }

    public function update(Goal $goal, array $data): Goal
    {
        $goal->update($data);
        return $goal->fresh();
    }

    public function delete(Goal $goal): void
    {
        $goal->delete();
    }
}
