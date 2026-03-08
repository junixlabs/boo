<?php

namespace App\Ai\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Tools\Request;

class ListGoalsTool extends BooTool
{
    public function description(): string
    {
        return 'List user goals with optional filters. Returns goal details including title, timeframe, status, and target date.';
    }

    public function execute(Request $request): string
    {
        $goals = $this->user->goals()
            ->filterByStatus($request['status'] ?? null)
            ->filterByTimeframe($request['timeframe'] ?? null)
            ->orderBy('sort_order', 'asc')
            ->get(['title', 'description', 'timeframe', 'status', 'target_date']);

        if ($goals->isEmpty()) {
            return 'No goals found.';
        }

        return $this->formatCollection($goals);
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'status' => $schema->string()->description('Filter by status: active, completed, cancelled')->enum(['active', 'completed', 'cancelled']),
            'timeframe' => $schema->string()->description('Filter by timeframe: yearly, quarterly')->enum(['yearly', 'quarterly']),
        ];
    }
}
