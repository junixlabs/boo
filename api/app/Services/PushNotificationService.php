<?php

namespace App\Services;

use App\Models\User;
use App\Notifications\PushNudgeNotification;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;

class PushNotificationService
{
    private const MAX_PUSH_PER_DAY = 4;

    private const COOLDOWN_MINUTES = 120;

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

        // Check quiet hours
        if ($setting && $this->isQuietHours($setting->quiet_hours_start, $setting->quiet_hours_end, $user->timezone ?? 'UTC')) {
            return false;
        }

        $nudges = $this->nudgeService->getNudges($user);

        if (empty($nudges)) {
            return false;
        }

        // Filter to high-priority only
        $highNudges = array_filter($nudges, fn ($n) => $n['priority'] === 'high');

        if (empty($highNudges)) {
            return false;
        }

        $today = now()->toDateString();
        $cacheKeyCount = "push_count_{$user->id}_{$today}";
        $cacheKeyCooldown = "push_cooldown_{$user->id}";
        $cacheKeySentTypes = "push_types_{$user->id}_{$today}";

        // Check daily limit
        $dailyCount = Cache::get($cacheKeyCount, 0);
        if ($dailyCount >= self::MAX_PUSH_PER_DAY) {
            return false;
        }

        // Check cooldown (2h between pushes)
        if (Cache::has($cacheKeyCooldown)) {
            return false;
        }

        // Get types already sent today
        $sentTypes = Cache::get($cacheKeySentTypes, []);

        // Find first high-priority nudge not already sent today
        $nudgeToSend = null;
        foreach ($highNudges as $nudge) {
            if (! in_array($nudge['type'], $sentTypes)) {
                $nudgeToSend = $nudge;
                break;
            }
        }

        if (! $nudgeToSend) {
            return false;
        }

        $user->notify(new PushNudgeNotification($nudgeToSend));

        // Update rate limiting
        Cache::put($cacheKeyCount, $dailyCount + 1, now()->endOfDay());
        Cache::put($cacheKeyCooldown, true, now()->addMinutes(self::COOLDOWN_MINUTES));
        Cache::put($cacheKeySentTypes, array_merge($sentTypes, [$nudgeToSend['type']]), now()->endOfDay());

        return true;
    }

    private function isQuietHours(string $start, string $end, string $timezone): bool
    {
        $now = Carbon::now($timezone);
        $currentTime = $now->format('H:i');

        // Handle overnight quiet hours (e.g., 22:00 - 08:00)
        if ($start > $end) {
            return $currentTime >= $start || $currentTime < $end;
        }

        // Handle same-day quiet hours (e.g., 13:00 - 15:00)
        return $currentTime >= $start && $currentTime < $end;
    }
}
