<?php

namespace App\Ai\Tools;

use App\Services\LearningTaskService;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Tools\Request;

class CreateLearningTaskTool extends BooTool
{
    public function description(): string
    {
        return 'Create a learning task for a skill. Requires title and skill_id. Use ListSkillsTool to find _ref.';
    }

    public function execute(Request $request): string
    {
        $skill = $this->user->skills()->find($request['skill_id']);
        if (! $skill) {
            return 'Error: Skill not found or does not belong to user.';
        }

        $data = array_filter([
            'title' => $request['title'],
            'description' => $request['description'] ?? null,
            'resource_url' => $request['resource_url'] ?? null,
        ], fn ($v) => $v !== null);

        $service = app(LearningTaskService::class);
        $learningTask = $service->create($skill, $this->user, $data);

        return 'Learning task created: ' . $this->formatModel($learningTask);
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'title' => $schema->string()->description('Learning task title')->required(),
            'skill_id' => $schema->integer()->description('Skill _ref. Look up by name, never ask user.')->required(),
            'description' => $schema->string()->description('Task description'),
            'resource_url' => $schema->string()->description('URL to learning resource'),
        ];
    }
}
