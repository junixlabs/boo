<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NotificationSettingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'push_enabled' => $this->push_enabled,
            'morning_time' => $this->morning_time,
            'evening_time' => $this->evening_time,
        ];
    }
}
