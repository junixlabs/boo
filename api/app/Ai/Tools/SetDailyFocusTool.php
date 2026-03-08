<?php

namespace App\Ai\Tools;

use App\Services\DailyFocusService;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Tools\Request;

class SetDailyFocusTool extends BooTool
{
    public function description(): string
    {
        return 'Add a task to daily focus. Maximum 3 focus items per day.';
    }

    public function execute(Request $request): string
    {
        $task = null;

        if ($request['task_id'] ?? null) {
            $task = $this->user->tasks()->find($request['task_id']);
        } elseif ($request['task_name'] ?? null) {
            $matches = $this->user->tasks()->where('title', 'ilike', '%' . $request['task_name'] . '%')->get();
            if ($matches->count() === 1) {
                $task = $matches->first();
            } elseif ($matches->count() > 1) {
                return 'Multiple tasks match "' . $request['task_name'] . '": ' . $matches->pluck('title')->join(', ') . '. Please be more specific.';
            }
        }

        if (! $task) {
            return 'Error: Task not found. Use ListTasksTool to find available tasks.';
        }

        $date = $request['date'] ?? now($this->user->timezone)->toDateString();

        $alreadyFocused = $this->user->dailyFocuses()
            ->where('task_id', $task->id)
            ->where('focus_date', $date)
            ->exists();

        if ($alreadyFocused) {
            return 'Task "' . $task->title . '" is already in daily focus for ' . $date . '.';
        }

        $existingCount = $this->user->dailyFocuses()->where('focus_date', $date)->count();

        if ($existingCount >= 3) {
            return 'Error: Maximum 3 focuses per day. Remove one before adding another.';
        }

        $service = app(DailyFocusService::class);
        $sortOrder = $request['sort_order'] ?? ($existingCount + 1);

        $focus = $service->create($this->user, [
            'task_id' => $task->id,
            'focus_date' => $date,
            'sort_order' => (int) $sortOrder,
        ]);

        return 'Daily focus set: ' . $this->formatModel($focus);
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'task_id' => $schema->integer()->description('Task _ref from ListTasksTool or CreateTaskTool result.'),
            'task_name' => $schema->string()->description('Task title to search for. Use this if you do not have the _ref.'),
            'date' => $schema->string()->description('Focus date in YYYY-MM-DD format. Default: today.'),
            'sort_order' => $schema->integer()->description('Position 1-3 in the focus list'),
        ];
    }
}
