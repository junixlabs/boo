<?php

namespace App\Ai\Tools;

use App\Services\FocusAreaService;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Tools\Request;

class CreateFocusAreaTool extends BooTool
{
    public function description(): string
    {
        return 'Create a focus area (key life area to balance, e.g. career, health, relationships). Requires title.';
    }

    public function execute(Request $request): string
    {
        $data = array_filter([
            'title' => $request['title'],
            'description' => $request['description'] ?? null,
        ], fn ($v) => $v !== null);

        $service = app(FocusAreaService::class);
        $focusArea = $service->create($this->user, $data);

        return 'Focus area created: ' . $this->formatModel($focusArea);
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'title' => $schema->string()->description('Focus area title (e.g. Career, Health, Relationships)')->required(),
            'description' => $schema->string()->description('Focus area description'),
        ];
    }
}
