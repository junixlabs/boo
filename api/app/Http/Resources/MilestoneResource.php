<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MilestoneResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'project_id' => $this->project_id,
            'title' => $this->title,
            'description' => $this->description,
            'status' => $this->status->value,
            'target_date' => $this->target_date?->toDateString(),
            'completed_at' => $this->completed_at?->toIso8601String(),
            'sort_order' => $this->sort_order,
            'tasks_count' => $this->whenCounted('tasks'),
            'tasks_done_count' => $this->when(isset($this->tasks_done_count), $this->tasks_done_count),
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
        ];
    }
}
