<?php

namespace App\Ai\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Tools\Request;

class ListProjectsTool extends BooTool
{
    public function description(): string
    {
        return 'List user projects with task counts. Returns project details including title, status, type, and number of tasks.';
    }

    public function execute(Request $request): string
    {
        $projects = $this->user->projects()
            ->withCount('tasks')
            ->filterByStatus($request['status'] ?? null)
            ->get(['id', 'title', 'status', 'type']);

        if ($projects->isEmpty()) {
            return 'No projects found.';
        }

        return $this->formatCollection($projects);
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'status' => $schema->string()->description('Filter by status: active, paused, completed, archived. Default: show all.')->enum(['active', 'paused', 'completed', 'archived']),
        ];
    }
}
