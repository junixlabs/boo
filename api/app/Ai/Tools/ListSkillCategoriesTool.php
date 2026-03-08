<?php

namespace App\Ai\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Tools\Request;

class ListSkillCategoriesTool extends BooTool
{
    public function description(): string
    {
        return 'List user skill categories with skill counts.';
    }

    public function execute(Request $request): string
    {
        $categories = $this->user->skillCategories()
            ->withCount('skills')
            ->get(['id', 'name']);

        if ($categories->isEmpty()) {
            return 'No skill categories found.';
        }

        return $this->formatCollection($categories);
    }

    public function schema(JsonSchema $schema): array
    {
        return [];
    }
}
