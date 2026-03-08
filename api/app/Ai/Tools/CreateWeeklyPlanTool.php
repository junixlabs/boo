<?php

namespace App\Ai\Tools;

use App\Services\WeeklyPlanService;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Tools\Request;

class CreateWeeklyPlanTool extends BooTool
{
    public function description(): string
    {
        return 'Create a weekly plan. Requires week start date. Optionally add summaries for completed, blocked, and next items.';
    }

    public function execute(Request $request): string
    {
        $existing = $this->user->weeklyPlans()->where('week_start', $request['week_start'])->first();
        if ($existing) {
            return 'Error: A weekly plan already exists for this week.';
        }

        $data = array_filter([
            'week_start' => $request['week_start'],
            'completed_summary' => $request['completed_summary'] ?? null,
            'blocked_summary' => $request['blocked_summary'] ?? null,
            'next_summary' => $request['next_summary'] ?? null,
        ], fn ($v) => $v !== null);

        $service = app(WeeklyPlanService::class);
        $plan = $service->create($this->user, $data);

        return 'Weekly plan created: ' . $this->formatModel($plan);
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'week_start' => $schema->string()->description('Start date of the week in YYYY-MM-DD format (must be a Monday)')->required(),
            'completed_summary' => $schema->string()->description('Summary of completed items'),
            'blocked_summary' => $schema->string()->description('Summary of blocked items'),
            'next_summary' => $schema->string()->description('Summary of planned next items'),
        ];
    }
}
