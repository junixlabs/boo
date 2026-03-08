<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReflectionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type->value,
            'period_start' => $this->period_start->toDateString(),
            'period_end' => $this->period_end->toDateString(),
            'went_well' => $this->went_well,
            'went_wrong' => $this->went_wrong,
            'to_improve' => $this->to_improve,
            'projects_progress' => $this->projects_progress,
            'skills_improved' => $this->skills_improved,
            'mistakes' => $this->mistakes,
            'opportunities' => $this->opportunities,
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
        ];
    }
}
