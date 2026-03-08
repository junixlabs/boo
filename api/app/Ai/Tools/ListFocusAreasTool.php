<?php

namespace App\Ai\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Tools\Request;

class ListFocusAreasTool extends BooTool
{
    public function description(): string
    {
        return 'List user focus areas (key life areas like career, health, relationships).';
    }

    public function execute(Request $request): string
    {
        $focusAreas = $this->user->focusAreas()
            ->get(['id', 'title', 'description', 'is_active']);

        if ($focusAreas->isEmpty()) {
            return 'No focus areas found.';
        }

        return $this->formatCollection($focusAreas);
    }

    public function schema(JsonSchema $schema): array
    {
        return [];
    }
}
