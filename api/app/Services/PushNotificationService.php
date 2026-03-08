<?php

namespace App\Services;

use App\Models\User;
use App\Notifications\PushNudgeNotification;
use Carbon\Carbon;

class PushNotificationService
{
    public function __construct(private NudgeService $nudgeService) {}

    public function sendScheduledNotifications(): bool
    {
        $user = User::first();

        if (! $user) {
            return false;
        }

        if ($user->pushSubscriptions()->count() === 0) {
            return false;
        }

        $setting = $user->notificationSetting;

        if ($setting && ! $setting->push_enabled) {
            return false;
        }

        $morningTime = $setting->morning_time ?? '08:00';
        $eveningTime = $setting->evening_time ?? '18:00';

        $now = Carbon::now($user->timezone ?? 'UTC')->format('H:i');

        if ($now !== $morningTime && $now !== $eveningTime) {
            return false;
        }

        $nudges = $this->nudgeService->getNudges($user);

        if (empty($nudges)) {
            return false;
        }

        $topNudge = $nudges[0];

        $user->notify(new PushNudgeNotification($topNudge));

        return true;
    }
}
