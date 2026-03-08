<?php

namespace App\Ai\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Tools\Request;

class ListSkillsTool extends BooTool
{
    public function description(): string
    {
        return 'List user skills with current and target levels. Optionally filter by category.';
    }

    public function execute(Request $request): string
    {
        $query = $this->user->skills()->with('category:id,name');

        if ($request['category_id'] ?? null) {
            $query->where('category_id', $request['category_id']);
        }

        $skills = $query->get(['id', 'category_id', 'name', 'current_level', 'target_level']);

        if ($skills->isEmpty()) {
            return 'No skills found.';
        }

        return $this->formatCollection($skills);
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'category_id' => $schema->integer()->description('Filter by skill category _ref. Use ListSkillCategoriesTool to find _ref.'),
        ];
    }
}
