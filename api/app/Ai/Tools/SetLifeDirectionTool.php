<?php

namespace App\Ai\Tools;

use App\Services\LifeDirectionService;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Tools\Request;

class SetLifeDirectionTool extends BooTool
{
    public function description(): string
    {
        return 'Set or update the user\'s life vision/direction. Creates if not exists, updates if exists.';
    }

    public function execute(Request $request): string
    {
        $service = app(LifeDirectionService::class);
        $direction = $service->updateVision($this->user, $request['vision']);

        return 'Life direction updated: ' . $this->formatModel($direction);
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'vision' => $schema->string()->description('The user\'s long-term personal vision')->required(),
        ];
    }
}
