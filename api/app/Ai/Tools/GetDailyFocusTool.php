<?php

namespace App\Ai\Tools;

use App\Services\DailyFocusService;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Tools\Request;

class GetDailyFocusTool extends BooTool
{
    public function description(): string
    {
        return 'Get daily focus items for a specific date. Returns the focused tasks for the day with their status and project.';
    }

    public function execute(Request $request): string
    {
        $service = app(DailyFocusService::class);
        $focuses = $service->listForDate($this->user, $request['date'] ?? null);

        if ($focuses->isEmpty()) {
            return 'No daily focus items found for this date.';
        }

        return $this->formatCollection($focuses);
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'date' => $schema->string()->description('Date in YYYY-MM-DD format. Default: today.'),
        ];
    }
}
