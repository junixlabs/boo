<?php

namespace App\Services;

use App\Models\User;
use Carbon\Carbon;

class DashboardService
{
    public function __construct(private StreakService $streakService) {}
    public function today(User $user): array
    {
        $today = Carbon::now($user->timezone)->toDateString();
        $weekStart = Carbon::now($user->timezone)->startOfWeek()->toDateString();

        $dailyFocuses = $user->dailyFocuses()
            ->with('task.project')
            ->where('focus_date', $today)
            ->orderBy('sort_order')
            ->get();

        $activeProjects = $user->projects()
            ->where('status', 'active')
            ->withCount(['tasks', 'tasks as tasks_done_count' => fn($q) => $q->where('status', 'done')])
            ->orderBy('priority')
            ->get();

        $overdueTasks = $user->tasks()
            ->with('project')
            ->whereNotIn('status', ['done', 'cancelled'])
            ->whereNotNull('due_date')
            ->where('due_date', '<', $today)
            ->orderBy('due_date')
            ->limit(10)
            ->get();

        $recentIdeasCount = $user->ideas()->where('status', 'inbox')->count();

        $tasksCompletedThisWeek = $user->tasks()
            ->where('status', 'done')
            ->where('completed_at', '>=', $weekStart)
            ->count();

        return [
            'date' => $today,
            'daily_focuses' => $dailyFocuses,
            'active_projects' => $activeProjects,
            'overdue_tasks' => $overdueTasks,
            'recent_ideas_count' => $recentIdeasCount,
            'tasks_completed_this_week' => $tasksCompletedThisWeek,
        ];
    }

    public function overview(User $user): array
    {
        $today = Carbon::now($user->timezone)->toDateString();
        $weekStart = Carbon::now($user->timezone)->startOfWeek()->toDateString();

        $todayFocuses = $user->dailyFocuses()
            ->with('task.project')
            ->where('focus_date', $today)
            ->orderBy('sort_order')
            ->get();

        $activeProjects = $user->projects()
            ->where('status', 'active')
            ->withCount([
                'tasks',
                'tasks as tasks_done_count' => fn($q) => $q->where('status', 'done'),
                'tasks as tasks_overdue_count' => fn($q) => $q->whereNotIn('status', ['done', 'cancelled'])
                    ->whereNotNull('due_date')
                    ->where('due_date', '<', $today),
            ])
            ->orderBy('priority')
            ->get();

        $projectHealth = $activeProjects->map(function ($project) {
            $total = $project->tasks_count;
            $done = $project->tasks_done_count;
            $overdue = $project->tasks_overdue_count;
            $donePercent = $total > 0 ? ($done / $total) * 100 : 100;
            $overduePercent = $total > 0 ? ($overdue / $total) * 100 : 0;

            if ($donePercent < 30 || $overduePercent > 50) {
                $status = 'blocked';
            } elseif ($donePercent < 70 || $overdue > 0) {
                $status = 'at_risk';
            } else {
                $status = 'on_track';
            }

            return [
                'project_id' => $project->id,
                'title' => $project->title,
                'status' => $status,
                'tasks_total' => $total,
                'tasks_done' => $done,
                'tasks_overdue' => $overdue,
            ];
        });

        $weeklyGoals = $user->goals()
            ->whereIn('status', ['active', 'completed'])
            ->selectRaw("count(*) as total, count(case when status = 'completed' then 1 end) as completed")
            ->first();

        $skillProgress = $user->skills()
            ->withCount(['learningTasks as recent_learning_count' => fn($q) => $q->where('status', 'done')->where('updated_at', '>=', $weekStart)])
            ->get()
            ->filter(fn ($s) => $s->recent_learning_count > 0)
            ->values();

        $recentNotes = $user->projects()
            ->where('status', 'active')
            ->with(['notes' => fn($q) => $q->latest()->limit(5)])
            ->get()
            ->pluck('notes')
            ->flatten()
            ->sortByDesc('created_at')
            ->take(5)
            ->values();

        $ideasInboxCount = $user->ideas()->where('status', 'inbox')->count();

        $overdueTasksCount = $user->tasks()
            ->whereNotIn('status', ['done', 'cancelled'])
            ->whereNotNull('due_date')
            ->where('due_date', '<', $today)
            ->count();

        $todayProgress = $this->streakService->getTodayProgress($user);

        return [
            'today_focus' => $todayFocuses,
            'active_projects' => $activeProjects,
            'project_health' => $projectHealth,
            'weekly_goals' => [
                'completed' => (int) ($weeklyGoals->completed ?? 0),
                'total' => (int) ($weeklyGoals->total ?? 0),
            ],
            'skill_progress' => $skillProgress,
            'recent_notes' => $recentNotes,
            'ideas_inbox_count' => $ideasInboxCount,
            'overdue_tasks_count' => $overdueTasksCount,
            'streak' => [
                'current_streak' => $this->streakService->calculateCurrentStreak($user),
                'longest_streak' => $this->streakService->calculateLongestStreak($user),
                'today_focus_total' => $todayProgress['total'],
                'today_focus_done' => $todayProgress['done'],
            ],
        ];
    }
}
