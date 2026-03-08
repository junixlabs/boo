<?php

namespace App\Ai\Tools;

use App\Services\GoalService;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Tools\Request;

class CreateGoalTool extends BooTool
{
    public function description(): string
    {
        return 'Create a new goal for the user. Requires title and timeframe.';
    }

    public function execute(Request $request): string
    {
        $data = array_filter([
            'title' => $request['title'],
            'timeframe' => $request['timeframe'],
            'target_date' => $request['target_date'] ?? null,
            'description' => $request['description'] ?? null,
        ], fn ($v) => $v !== null);

        $service = app(GoalService::class);
        $goal = $service->create($this->user, $data);

        return 'Goal created: ' . $this->formatModel($goal);
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'title' => $schema->string()->description('Goal title')->required(),
            'timeframe' => $schema->string()->description('Goal timeframe')->enum(['yearly', 'quarterly'])->required(),
            'target_date' => $schema->string()->description('Target date in YYYY-MM-DD format'),
            'description' => $schema->string()->description('Goal description'),
        ];
    }
}
