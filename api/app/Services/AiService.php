<?php

namespace App\Services;

use App\Ai\Agents\ReviewPromptAgent;
use App\Ai\Agents\SuggestPrioritiesAgent;
use App\Ai\Agents\WeeklySummaryAgent;
use App\Models\User;
use Carbon\Carbon;

class AiService
{
    public function weeklySummary(User $user, string $weekStart): array
    {
        $start = Carbon::parse($weekStart);
        $end = $start->copy()->endOfWeek();

        $tasksDone = $user->tasks()
            ->where('status', 'done')
            ->whereBetween('completed_at', [$start, $end])
            ->with('project:id,title')
            ->get(['id', 'title', 'project_id', 'priority', 'completed_at']);

        $activeProjects = $user->projects()
            ->where('status', 'active')
            ->get(['id', 'title', 'priority']);

        $goals = $user->goals()
            ->where('status', 'active')
            ->get(['id', 'title', 'timeframe']);

        $skillsPracticed = $user->skills()
            ->whereHas('learningTasks', fn ($q) => $q->where('status', 'done')->whereBetween('updated_at', [$start, $end]))
            ->get(['id', 'name', 'current_level']);

        $dailyFocuses = $user->dailyFocuses()
            ->with('task:id,status')
            ->whereBetween('focus_date', [$start->toDateString(), $end->toDateString()])
            ->get();

        $prompt = "Weekly data ({$start->toDateString()} to {$end->toDateString()}):\n"
            . "Tasks completed: " . $tasksDone->count() . "\n"
            . "Tasks: " . $tasksDone->pluck('title')->implode(', ') . "\n"
            . "Active projects: " . $activeProjects->pluck('title')->implode(', ') . "\n"
            . "Active goals: " . $goals->pluck('title')->implode(', ') . "\n"
            . "Skills practiced: " . $skillsPracticed->pluck('name')->implode(', ') . "\n"
            . "Daily focuses set: " . $dailyFocuses->count() . ", completed: " . $dailyFocuses->filter(fn ($f) => $f->task?->status?->value === 'done')->count();

        $response = (new WeeklySummaryAgent)->prompt($prompt);

        return [
            'summary' => $response['summary'],
            'highlights' => $response['highlights'],
            'concerns' => $response['concerns'],
            'suggestions' => $response['suggestions'],
        ];
    }

    public function suggestPriorities(User $user, string $date): array
    {
        $today = Carbon::parse($date);

        $activeTasks = $user->tasks()
            ->whereNotIn('status', ['done', 'cancelled'])
            ->with('project:id,title,priority')
            ->get(['id', 'title', 'priority', 'due_date', 'status', 'project_id']);

        $overdueTasks = $activeTasks->filter(fn ($t) => $t->due_date && $t->due_date < $today);

        $currentFocuses = $user->dailyFocuses()
            ->where('focus_date', $today->toDateString())
            ->with('task:id,title')
            ->get();

        $activeGoals = $user->goals()
            ->where('status', 'active')
            ->get(['id', 'title', 'timeframe', 'target_date']);

        $prompt = "Date: {$today->toDateString()}\n"
            . "Active tasks (" . $activeTasks->count() . "):\n"
            . $activeTasks->map(fn ($t) => "- [ID:{$t->id}] {$t->title} (priority:{$t->priority->value}, due:{$t->due_date?->toDateString()}, project:{$t->project?->title})")->implode("\n") . "\n"
            . "Overdue tasks: " . $overdueTasks->count() . "\n"
            . "Current focuses: " . $currentFocuses->pluck('task.title')->filter()->implode(', ') . "\n"
            . "Active goals: " . $activeGoals->pluck('title')->implode(', ');

        $response = (new SuggestPrioritiesAgent)->prompt($prompt);

        return [
            'suggested_focuses' => $response['suggested_focuses'],
        ];
    }

    public function reviewPrompt(User $user, string $type, string $periodStart): array
    {
        $start = Carbon::parse($periodStart);
        $end = $type === 'weekly' ? $start->copy()->addWeek() : $start->copy()->addMonth();

        $tasksDone = $user->tasks()
            ->where('status', 'done')
            ->whereBetween('completed_at', [$start, $end])
            ->get(['id', 'title', 'project_id']);

        $tasksNotDone = $user->tasks()
            ->whereNotIn('status', ['done', 'cancelled'])
            ->where('created_at', '<=', $end)
            ->get(['id', 'title', 'status', 'project_id']);

        $projectActivity = $user->projects()
            ->where('status', 'active')
            ->withCount(['tasks as period_tasks_done' => fn ($q) => $q->where('status', 'done')->whereBetween('completed_at', [$start, $end])])
            ->get(['id', 'title']);

        $skillsProgress = $user->skills()
            ->withCount(['learningTasks as period_learning_done' => fn ($q) => $q->where('status', 'done')->whereBetween('updated_at', [$start, $end])])
            ->get(['id', 'name'])
            ->filter(fn ($s) => $s->period_learning_done > 0)
            ->values();

        $goals = $user->goals()
            ->where('status', 'active')
            ->get(['id', 'title', 'timeframe']);

        $prompt = "Reflection type: {$type}\n"
            . "Period: {$start->toDateString()} to {$end->toDateString()}\n"
            . "Tasks completed: " . $tasksDone->count() . " (" . $tasksDone->pluck('title')->implode(', ') . ")\n"
            . "Tasks pending: " . $tasksNotDone->count() . "\n"
            . "Project activity: " . $projectActivity->map(fn ($p) => "{$p->title} ({$p->period_tasks_done} tasks done)")->implode(', ') . "\n"
            . "Skills progressed: " . $skillsProgress->pluck('name')->implode(', ') . "\n"
            . "Active goals: " . $goals->pluck('title')->implode(', ');

        $response = (new ReviewPromptAgent)->prompt($prompt);

        return [
            'prompts' => $response['prompts'],
        ];
    }
}
