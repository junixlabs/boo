<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'type' => $this->type->value,
            'status' => $this->status->value,
            'vision' => $this->vision,
            'priority' => $this->priority,
            'repo_url' => $this->repo_url,
            'start_date' => $this->start_date?->toDateString(),
            'target_date' => $this->target_date?->toDateString(),
            'tasks_count' => $this->whenCounted('tasks'),
            'tasks_done_count' => $this->when(isset($this->tasks_done_count), $this->tasks_done_count),
            'milestones_count' => $this->whenCounted('milestones'),
            'milestones_done_count' => $this->when(isset($this->milestones_done_count), $this->milestones_done_count),
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
        ];
    }
}
