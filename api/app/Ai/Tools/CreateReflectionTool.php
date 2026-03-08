<?php

namespace App\Ai\Tools;

use App\Services\ReflectionService;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Tools\Request;

class CreateReflectionTool extends BooTool
{
    public function description(): string
    {
        return 'Create a weekly or monthly reflection. Requires type, period_start, period_end, and at least one content field.';
    }

    public function execute(Request $request): string
    {
        $data = array_filter([
            'type' => $request['type'],
            'period_start' => $request['period_start'],
            'period_end' => $request['period_end'],
            'went_well' => $request['went_well'] ?? null,
            'went_wrong' => $request['went_wrong'] ?? null,
            'to_improve' => $request['to_improve'] ?? null,
        ], fn ($v) => $v !== null);

        $service = app(ReflectionService::class);
        $reflection = $service->create($this->user, $data);

        return 'Reflection created: ' . $this->formatModel($reflection);
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'type' => $schema->string()->description('Reflection type')->enum(['weekly', 'monthly'])->required(),
            'period_start' => $schema->string()->description('Period start date YYYY-MM-DD')->required(),
            'period_end' => $schema->string()->description('Period end date YYYY-MM-DD')->required(),
            'went_well' => $schema->string()->description('What went well'),
            'went_wrong' => $schema->string()->description('What went wrong'),
            'to_improve' => $schema->string()->description('What to improve'),
        ];
    }
}
