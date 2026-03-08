<?php

namespace App\Ai\Tools;

use App\Services\IdeaService;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Tools\Request;

class CreateIdeaTool extends BooTool
{
    public function description(): string
    {
        return 'Capture a new idea into the inbox. Requires title.';
    }

    public function execute(Request $request): string
    {
        $data = array_filter([
            'title' => $request['title'],
            'description' => $request['description'] ?? null,
            'category' => $request['category'] ?? null,
        ], fn ($v) => $v !== null);

        $service = app(IdeaService::class);
        $idea = $service->create($this->user, $data);

        return 'Idea captured: ' . $this->formatModel($idea);
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'title' => $schema->string()->description('Idea title')->required(),
            'description' => $schema->string()->description('Idea description'),
            'category' => $schema->string()->description('Category tag for the idea'),
        ];
    }
}
