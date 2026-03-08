<?php

namespace App\Services;

use App\Models\Reflection;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ReflectionService
{
    public function list(User $user, array $filters): LengthAwarePaginator
    {
        return $user->reflections()
            ->filterByType($filters['type'] ?? null)
            ->orderBy($filters['sort'] ?? 'period_start', $filters['order'] ?? 'desc')
            ->paginate($filters['per_page'] ?? 10);
    }

    public function create(User $user, array $data): Reflection
    {
        return $user->reflections()->create($data)->fresh();
    }

    public function update(Reflection $reflection, array $data): Reflection
    {
        $reflection->update($data);
        return $reflection->fresh();
    }

    public function delete(Reflection $reflection): void
    {
        $reflection->delete();
    }
}
