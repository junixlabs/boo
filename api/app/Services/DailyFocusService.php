<?php

namespace App\Services;

use App\Models\DailyFocus;
use App\Models\Task;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;

class DailyFocusService
{
    public function listForDate(User $user, ?string $date = null): Collection
    {
        $date = $date ?? Carbon::now($user->timezone)->toDateString();

        return $user->dailyFocuses()
            ->with('task.project')
            ->where('focus_date', $date)
            ->orderBy('sort_order')
            ->get();
    }

    public function create(User $user, array $data): DailyFocus
    {
        $data['user_id'] = $user->id;
        $data['focus_date'] = $data['focus_date'] ?? Carbon::now($user->timezone)->toDateString();

        $existingCount = $user->dailyFocuses()
            ->where('focus_date', $data['focus_date'])
            ->count();

        abort_if($existingCount >= 3, 422, 'Maximum 3 focuses per day.');

        return DailyFocus::create($data)->fresh()->load('task.project');
    }

    public function update(DailyFocus $dailyFocus, array $data): DailyFocus
    {
        $dailyFocus->update($data);
        return $dailyFocus->fresh()->load('task.project');
    }

    public function delete(DailyFocus $dailyFocus): void
    {
        $dailyFocus->delete();
    }

    public function reorder(User $user, string $date, array $order): Collection
    {
        $focuses = $user->dailyFocuses()
            ->where('focus_date', $date)
            ->get()
            ->keyBy('id');

        foreach ($order as $index => $id) {
            if ($focuses->has($id)) {
                $focuses[$id]->update(['sort_order' => $index + 1]);
            }
        }

        return $user->dailyFocuses()
            ->with('task.project')
            ->where('focus_date', $date)
            ->orderBy('sort_order')
            ->get();
    }

    public function suggestFocusTasks(User $user): array
    {
        $now = Carbon::now($user->timezone ?? 'UTC');
        $today = $now->toDateString();

        // Get task IDs already focused today
        $focusedTaskIds = $user->dailyFocuses()
            ->where('focus_date', $today)
            ->pluck('task_id')
            ->toArray();

        // Get all previously focused task IDs (for "previously focused but not done" bonus)
        $previouslyFocusedTaskIds = $user->dailyFocuses()
            ->where('focus_date', '<', $today)
            ->pluck('task_id')
            ->unique()
            ->toArray();

        // Query eligible tasks
        $tasks = $user->tasks()
            ->whereIn('status', ['todo', 'in_progress'])
            ->when(! empty($focusedTaskIds), fn ($q) => $q->whereNotIn('id', $focusedTaskIds))
            ->with('project:id,title')
            ->get();

        $scored = [];

        foreach ($tasks as $task) {
            $score = 0;
            $reasons = [];

            // Due date proximity
            if ($task->due_date) {
                $daysUntilDue = $now->startOfDay()->diffInDays($task->due_date, false);

                if ($daysUntilDue <= 1) {
                    $score += 10;
                    $reasons[] = 'Sắp đến hạn';
                } elseif ($daysUntilDue <= 2) {
                    $score += 8;
                    $reasons[] = 'Còn 2 ngày';
                } elseif ($daysUntilDue <= 3) {
                    $score += 5;
                    $reasons[] = 'Còn 3 ngày';
                } elseif ($daysUntilDue <= 7) {
                    $score += 2;
                    $reasons[] = 'Trong tuần này';
                }
            }

            // Priority
            $priorityValue = $task->priority->value;
            if ($priorityValue === 'high') {
                $score += 8;
                $reasons[] = 'Ưu tiên cao';
            } elseif ($priorityValue === 'medium') {
                $score += 4;
                $reasons[] = 'Ưu tiên trung bình';
            } else {
                $score += 1;
            }

            // Stuck bonus
            if ($task->status->value === 'in_progress' && $task->updated_at->diffInDays($now) > 3) {
                $score += 3;
                $reasons[] = 'Đang stuck';
            }

            // Goal connection
            if ($task->milestone_id) {
                $score += 2;
                $reasons[] = 'Thuộc milestone';
            }

            // Previously focused but not done
            if (in_array($task->id, $previouslyFocusedTaskIds)) {
                $score += 3;
                $reasons[] = 'Đã focus trước đó';
            }

            if ($score > 0) {
                $scored[] = [
                    'task' => $task,
                    'score' => $score,
                    'reasons' => $reasons,
                ];
            }
        }

        // Sort by score descending
        usort($scored, fn ($a, $b) => $b['score'] <=> $a['score']);

        return array_slice($scored, 0, 5);
    }
}
