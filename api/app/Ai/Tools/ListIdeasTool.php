<?php

namespace App\Ai\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Tools\Request;

class ListIdeasTool extends BooTool
{
    public function description(): string
    {
        return 'List user ideas with optional status filter. Returns idea details including title, description, category, and status.';
    }

    public function execute(Request $request): string
    {
        $ideas = $this->user->ideas()
            ->filterByStatus($request['status'] ?? null)
            ->orderByDesc('created_at')
            ->limit($request['limit'] ?? 10)
            ->get(['title', 'description', 'category', 'status']);

        if ($ideas->isEmpty()) {
            return 'No ideas found.';
        }

        return $this->formatCollection($ideas);
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'status' => $schema->string()->description('Filter by status: inbox, converted, discarded. Default: show all.')->enum(['inbox', 'converted', 'discarded']),
            'limit' => $schema->integer()->description('Max results to return, default 10'),
        ];
    }
}
