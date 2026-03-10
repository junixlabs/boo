<?php

namespace App\Ai\Tools;

use App\Services\TaskService;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Tools\Request;

class UpdateTaskTool extends BooTool
{
    public function description(): string
    {
        return 'Update a task fields like title, priority, due date, description, or move to another project.';
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

        $data = array_filter([
            'title' => $request['title'] ?? null,
            'priority' => $request['priority'] ?? null,
            'due_date' => $request['due_date'] ?? null,
            'description' => $request['description'] ?? null,
            'expected_outcome' => $request['expected_outcome'] ?? null,
            'project_id' => $request['project_id'] ?? null,
        ], fn ($v) => $v !== null);

        if (empty($data)) {
            return 'Error: No fields to update. Provide at least one field (title, priority, due_date, description, expected_outcome, or project_id).';
        }

        if (isset($data['project_id'])) {
            $project = $this->user->projects()->find($data['project_id']);
            if (! $project) {
                return 'Error: Project not found or does not belong to user.';
            }
        }

        $service = app(TaskService::class);
        $updated = $service->update($task, $data);

        return 'Task updated: ' . $this->formatModel($updated);
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'task_id' => $schema->integer()->description('Task _ref from ListTasksTool result.'),
            'task_name' => $schema->string()->description('Task title to search for. Use this if you do not have the _ref.'),
            'title' => $schema->string()->description('New title for the task.'),
            'priority' => $schema->string()->description('New priority')->enum(['high', 'medium', 'low']),
            'due_date' => $schema->string()->description('New due date in YYYY-MM-DD format.'),
            'description' => $schema->string()->description('New description.'),
            'expected_outcome' => $schema->string()->description('Expected outcome of the task.'),
            'project_id' => $schema->integer()->description('Project _ref to move task to. Look up by name using ListProjectsTool, never ask user.'),
        ];
    }
}
