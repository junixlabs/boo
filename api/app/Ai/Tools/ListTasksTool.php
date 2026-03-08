<?php

namespace App\Ai\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Tools\Request;

class ListTasksTool extends BooTool
{
    public function description(): string
    {
        return 'List user tasks with optional filters by status, priority, project. Returns task details including title, status, priority, due date, and project name.';
    }

    public function execute(Request $request): string
    {
        $tasks = $this->user->tasks()
            ->with('project:id,title')
            ->filterByStatus($request['status'] ?? null)
            ->filterByPriority($request['priority'] ?? null)
            ->filterByProject($request['project_id'] ?? null)
            ->orderBy('due_date', 'asc')
            ->limit($request['limit'] ?? 10)
            ->get(['id', 'project_id', 'title', 'status', 'priority', 'due_date']);

        if ($tasks->isEmpty()) {
            return 'No tasks found matching the filters.';
        }

        return $this->formatCollection($tasks);
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'status' => $schema->string()->description('Filter by status: todo, in_progress, done, cancelled. Comma-separated for multiple.'),
            'priority' => $schema->string()->description('Filter by priority: high, medium, low')->enum(['high', 'medium', 'low']),
            'project_id' => $schema->integer()->description('Filter by project ID'),
            'limit' => $schema->integer()->description('Max results to return, default 10'),
        ];
    }
}
