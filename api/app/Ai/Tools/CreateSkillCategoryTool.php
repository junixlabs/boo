<?php

namespace App\Ai\Tools;

use App\Services\SkillCategoryService;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Tools\Request;

class CreateSkillCategoryTool extends BooTool
{
    public function description(): string
    {
        return 'Create a skill category to group related skills (e.g. Programming, Design, Languages). Requires name.';
    }

    public function execute(Request $request): string
    {
        $data = ['name' => $request['name']];

        $service = app(SkillCategoryService::class);
        $category = $service->create($this->user, $data);

        return 'Skill category created: ' . $this->formatModel($category);
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'name' => $schema->string()->description('Skill category name (e.g. Programming, Design)')->required(),
        ];
    }
}
