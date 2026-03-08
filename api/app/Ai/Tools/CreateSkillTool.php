<?php

namespace App\Ai\Tools;

use App\Services\SkillCategoryService;
use App\Services\SkillService;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Tools\Request;

class CreateSkillTool extends BooTool
{
    public function description(): string
    {
        return 'Create a skill under a category. Requires name and category_id. Use ListSkillCategoriesTool to find _ref.';
    }

    public function execute(Request $request): string
    {
        $category = $this->user->skillCategories()->find($request['category_id']);
        if (! $category) {
            return 'Error: Skill category not found or does not belong to user.';
        }

        $data = array_filter([
            'category_id' => $request['category_id'],
            'name' => $request['name'],
            'current_level' => $request['current_level'] ?? null,
            'target_level' => $request['target_level'] ?? null,
            'notes' => $request['notes'] ?? null,
        ], fn ($v) => $v !== null);

        $service = app(SkillService::class);
        $skill = $service->create($this->user, $data);

        return 'Skill created: ' . $this->formatModel($skill);
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'name' => $schema->string()->description('Skill name (e.g. Laravel, React, Public Speaking)')->required(),
            'category_id' => $schema->integer()->description('Skill category _ref. Look up by name, never ask user.')->required(),
            'current_level' => $schema->string()->description('Current proficiency level')->enum(['beginner', 'intermediate', 'advanced', 'expert']),
            'target_level' => $schema->string()->description('Target proficiency level')->enum(['beginner', 'intermediate', 'advanced', 'expert']),
            'notes' => $schema->string()->description('Notes about this skill'),
        ];
    }
}
