<?php

namespace App\Ai\Tools;

use App\Services\TaskService;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Tools\Request;

class CreateTaskTool extends BooTool
{
    public function description(): string
    {
        return 'Create a new task for the user. Requires a title. Optionally set project, priority, due date, and description.';
    }

    public function execute(Request $request): string
    {
        $data = array_filter([
            'title' => $request['title'],
            'project_id' => $request['project_id'] ?? null,
            'priority' => $request['priority'] ?? null,
            'due_date' => $request['due_date'] ?? null,
            'description' => $request['description'] ?? null,
        ], fn ($v) => $v !== null);

        if (isset($data['project_id'])) {
            $project = $this->user->projects()->find($data['project_id']);
            if (! $project) {
                return 'Error: Project not found or does not belong to user.';
            }
        }

        $service = app(TaskService::class);
        $task = $service->create($this->user, $data);

        return 'Task created: ' . $this->formatModel($task);
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'title' => $schema->string()->description('Task title')->required(),
            'project_id' => $schema->integer()->description('Project _ref from ListProjectsTool. Look up by name, never ask user.'),
            'priority' => $schema->string()->description('Task priority')->enum(['high', 'medium', 'low']),
            'due_date' => $schema->string()->description('Due date in YYYY-MM-DD format'),
            'description' => $schema->string()->description('Task description'),
        ];
    }
}
