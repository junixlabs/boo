<?php

namespace App\Ai\Tools;

use App\Services\ProjectService;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Tools\Request;

class CreateProjectTool extends BooTool
{
    public function description(): string
    {
        return 'Create a new project for the user. Requires title and type.';
    }

    public function execute(Request $request): string
    {
        $data = array_filter([
            'title' => $request['title'],
            'type' => $request['type'],
            'description' => $request['description'] ?? null,
            'start_date' => $request['start_date'] ?? null,
            'target_date' => $request['target_date'] ?? null,
        ], fn ($v) => $v !== null);

        $service = app(ProjectService::class);
        $project = $service->create($this->user, $data);

        return 'Project created: ' . $this->formatModel($project);
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'title' => $schema->string()->description('Project title')->required(),
            'type' => $schema->string()->description('Project type')->enum(['company', 'personal_startup', 'experiment', 'learning'])->required(),
            'description' => $schema->string()->description('Project description'),
            'start_date' => $schema->string()->description('Start date in YYYY-MM-DD format'),
            'target_date' => $schema->string()->description('Target date in YYYY-MM-DD format'),
        ];
    }
}
