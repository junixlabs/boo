<?php

namespace App\Ai\Tools;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Laravel\Ai\Contracts\Tool;

abstract class BooTool implements Tool
{
    abstract protected function execute(\Laravel\Ai\Tools\Request $request): string;

    public function handle(\Laravel\Ai\Tools\Request $request): string
    {
        try {
            return $this->execute($request);
        } catch (\Throwable $e) {
            return 'Error: ' . $e->getMessage();
        }
    }

    private const LABELS = [
        'status' => [
            'todo' => 'To Do',
            'in_progress' => 'In Progress',
            'done' => 'Done',
            'cancelled' => 'Cancelled',
            'active' => 'Active',
            'paused' => 'Paused',
            'completed' => 'Completed',
            'archived' => 'Archived',
            'inbox' => 'Inbox',
            'converted' => 'Converted',
            'discarded' => 'Discarded',
            'pending' => 'Pending',
        ],
        'priority' => [
            'high' => 'High',
            'medium' => 'Medium',
            'low' => 'Low',
        ],
        'type' => [
            'company' => 'Company',
            'personal_startup' => 'Personal Startup',
            'experiment' => 'Experiment',
            'learning' => 'Learning',
            'weekly' => 'Weekly',
            'monthly' => 'Monthly',
        ],
        'timeframe' => [
            'yearly' => 'Yearly',
            'quarterly' => 'Quarterly',
        ],
        'current_level' => [
            'beginner' => 'Beginner',
            'intermediate' => 'Intermediate',
            'advanced' => 'Advanced',
            'expert' => 'Expert',
        ],
        'target_level' => [
            'beginner' => 'Beginner',
            'intermediate' => 'Intermediate',
            'advanced' => 'Advanced',
            'expert' => 'Expert',
        ],
    ];

    public function __construct(protected User $user) {}

    protected function formatCollection(Collection $items): string
    {
        return json_encode($items->map(fn ($item) => $this->applyLabels($item->toArray())));
    }

    protected function formatModel(Model $model): string
    {
        return json_encode($this->applyLabels($model->toArray()));
    }

    private function applyLabels(array $item, bool $isNested = false): array
    {
        // Rename id to _ref (internal reference for tool chaining, never show to user)
        if (isset($item['id']) && ! $isNested) {
            $item['_ref'] = $item['id'];
        }
        unset($item['id']);

        // Strip foreign keys (project_id, user_id, task_id, etc.)
        foreach (array_keys($item) as $key) {
            if (str_ends_with($key, '_id')) {
                unset($item[$key]);
            }
        }

        foreach (self::LABELS as $field => $map) {
            if (isset($item[$field]) && isset($map[$item[$field]])) {
                $item[$field] = $map[$item[$field]];
            }
        }

        foreach ($item as $key => $value) {
            if (is_array($value)) {
                $item[$key] = $this->applyLabels($value, true);
            }
        }

        return $item;
    }
}
