<?php

namespace App\Services;

use App\Models\User;
use App\Models\WeeklyPlan;
use Carbon\Carbon;

class WeeklyPlanService
{
    public function get(User $user, array $filters): array
    {
        $weekStart = $filters['week_start']
            ?? Carbon::now($user->timezone)->startOfWeek()->toDateString();

        $plan = $user->weeklyPlans()->where('week_start', $weekStart)->first();

        $tasksCompleted = $user->tasks()
            ->where('status', 'done')
            ->whereBetween('completed_at', [
                $weekStart,
                Carbon::parse($weekStart)->endOfWeek(),
            ])
            ->with('project')
            ->get();

        return [
            'plan' => $plan,
            'tasks_completed' => $tasksCompleted,
        ];
    }

    public function create(User $user, array $data): WeeklyPlan
    {
        return $user->weeklyPlans()->create($data)->fresh();
    }

    public function update(WeeklyPlan $weeklyPlan, array $data): WeeklyPlan
    {
        $weeklyPlan->update($data);

        return $weeklyPlan->fresh();
    }
}
