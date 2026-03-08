<?php

namespace App\Services;

use App\Models\LifeDirection;
use App\Models\User;

class LifeDirectionService
{
    public function get(User $user): array
    {
        $lifeDirection = LifeDirection::updateOrCreate(
            ['user_id' => $user->id],
            []
        );

        $goals = $user->goals()->orderBy('sort_order')->get();
        $focusAreas = $user->focusAreas()->orderBy('sort_order')->get();

        return [
            'vision' => $lifeDirection->vision,
            'goals' => $goals,
            'focus_areas' => $focusAreas,
            'updated_at' => $lifeDirection->updated_at,
        ];
    }

    public function updateVision(User $user, string $vision): LifeDirection
    {
        return LifeDirection::updateOrCreate(
            ['user_id' => $user->id],
            ['vision' => $vision, 'updated_at' => now()]
        );
    }
}
