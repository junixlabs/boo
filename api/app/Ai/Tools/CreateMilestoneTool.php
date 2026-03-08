<?php

namespace App\Ai\Tools;

use App\Services\MilestoneService;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Tools\Request;

class CreateMilestoneTool extends BooTool
{
    public function description(): string
    {
        return 'Create a milestone for a project. Requires title and project_id (use ListProjectsTool to find _ref).';
    }

    public function execute(Request $request): string
    {
        $project = $this->user->projects()->find($request['project_id']);
        if (! $project) {
            return 'Error: Project not found or does not belong to user.';
        }

        $data = array_filter([
            'title' => $request['title'],
            'description' => $request['description'] ?? null,
            'target_date' => $request['target_date'] ?? null,
        ], fn ($v) => $v !== null);

        $service = app(MilestoneService::class);
        $milestone = $service->create($project, $data);

        return 'Milestone created: ' . $this->formatModel($milestone);
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'title' => $schema->string()->description('Milestone title')->required(),
            'project_id' => $schema->integer()->description('Project _ref from ListProjectsTool. Look up by name, never ask user.')->required(),
            'description' => $schema->string()->description('Milestone description'),
            'target_date' => $schema->string()->description('Target date in YYYY-MM-DD format'),
        ];
    }
}
