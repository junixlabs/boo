<?php

namespace App\Ai\Tools;

use App\Services\TaskService;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Tools\Request;

class UpdateTaskStatusTool extends BooTool
{
    public function description(): string
    {
        return 'Update a task status. Change task to todo, in_progress, done, or cancelled.';
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

        $service = app(TaskService::class);
        $updated = $service->updateStatus($task, $request['status']);

        return 'Task updated: ' . $this->formatModel($updated);
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'task_id' => $schema->integer()->description('Task _ref from ListTasksTool or CreateTaskTool result.'),
            'task_name' => $schema->string()->description('Task title to search for. Use this if you do not have the _ref.'),
            'status' => $schema->string()->description('New status for the task')->enum(['todo', 'in_progress', 'done', 'cancelled'])->required(),
        ];
    }
}
