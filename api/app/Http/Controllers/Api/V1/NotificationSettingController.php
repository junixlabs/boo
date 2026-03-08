<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateNotificationSettingRequest;
use App\Http\Resources\NotificationSettingResource;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationSettingController extends Controller
{
    use ApiResponse;

    public function show(Request $request): JsonResponse
    {
        $setting = $request->user()->notificationSetting()
            ->firstOrCreate([]);

        return $this->success(new NotificationSettingResource($setting));
    }

    public function update(UpdateNotificationSettingRequest $request): JsonResponse
    {
        $setting = $request->user()->notificationSetting()
            ->updateOrCreate([], $request->validated());

        return $this->success(new NotificationSettingResource($setting->fresh()));
    }
}
