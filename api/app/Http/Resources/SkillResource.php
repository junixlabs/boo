<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SkillResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'category_id' => $this->category_id,
            'name' => $this->name,
            'current_level' => $this->current_level->value,
            'target_level' => $this->target_level->value,
            'notes' => $this->notes,
            'learning_tasks_count' => $this->whenCounted('learningTasks'),
            'learning_tasks_done_count' => $this->when(isset($this->learning_tasks_done_count), $this->learning_tasks_done_count),
            'recent_learning_count' => $this->when(isset($this->recent_learning_count), $this->recent_learning_count),
            'projects' => ProjectResource::collection($this->whenLoaded('projects')),
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
        ];
    }
}
