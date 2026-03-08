<?php

namespace App\Services;

use App\Models\FocusArea;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class FocusAreaService
{
    public function list(User $user, array $filters): Collection
    {
        $isActive = isset($filters['is_active']) ? filter_var($filters['is_active'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) : null;

        return $user->focusAreas()
            ->filterByActive($isActive)
            ->orderBy('sort_order', 'asc')
            ->get();
    }

    public function create(User $user, array $data): FocusArea
    {
        return $user->focusAreas()->create($data)->fresh();
    }

    public function update(FocusArea $focusArea, array $data): FocusArea
    {
        $focusArea->update($data);
        return $focusArea->fresh();
    }

    public function delete(FocusArea $focusArea): void
    {
        $focusArea->delete();
    }
}
