<?php

namespace App\Services;

use App\Models\User;
use Carbon\Carbon;

class StreakService
{
    public function calculateCurrentStreak(User $user): int
    {
        $timezone = $user->timezone ?? 'UTC';
        $today = Carbon::now($timezone)->toDateString();

        $focusDates = $user->dailyFocuses()
            ->with('task:id,status')
            ->orderBy('focus_date', 'desc')
            ->get()
            ->groupBy(fn ($f) => $f->focus_date->toDateString());

        $streak = 0;
        $date = Carbon::parse($today, $timezone);

        // If today has focus and qualifies → include in streak
        // If today has focus but doesn't qualify → start from yesterday
        // If today has no focus → start from yesterday
        $todayFocuses = $focusDates[$today] ?? null;
        if (! $todayFocuses || ! $this->isDayQualified($todayFocuses)) {
            $date->subDay();
        }

        $restDaysUsed = 0;
        $windowDays = 0;

        while (true) {
            $dateStr = $date->toDateString();
            $focuses = $focusDates[$dateStr] ?? null;

            if (! $focuses || $focuses->isEmpty()) {
                // No focus this day - check if we can use a rest day
                // Allow 1 rest day per 7-day window
                if ($restDaysUsed < 1 && $streak > 0) {
                    $restDaysUsed++;
                    $windowDays++;
                    $date->subDay();

                    continue;
                }

                break;
            }

            if (! $this->isDayQualified($focuses)) {
                break;
            }

            $streak++;
            $windowDays++;

            // Reset rest day allowance every 7 days
            if ($windowDays >= 7) {
                $windowDays = 0;
                $restDaysUsed = 0;
            }

            $date->subDay();
        }

        return $streak;
    }

    private function isDayQualified($focuses): bool
    {
        if ($focuses->isEmpty()) {
            return false;
        }

        $total = $focuses->count();
        $doneCount = $focuses->filter(fn ($f) => $f->task && $f->task->status->value === 'done')->count();

        // Qualifies if done_count >= min(2, total_count)
        return $doneCount >= min(2, $total);
    }

    public function calculateLongestStreak(User $user): int
    {
        $focusDates = $user->dailyFocuses()
            ->with('task:id,status')
            ->orderBy('focus_date', 'asc')
            ->get()
            ->groupBy(fn ($f) => $f->focus_date->toDateString());

        $longestStreak = 0;
        $currentStreak = 0;
        $previousDate = null;

        foreach ($focusDates as $dateStr => $focuses) {
            $allDone = $focuses->every(fn ($f) => $f->task && $f->task->status->value === 'done');

            if (! $allDone) {
                $currentStreak = 0;
                $previousDate = null;

                continue;
            }

            if ($previousDate && Carbon::parse($dateStr)->diffInDays(Carbon::parse($previousDate)) === 1) {
                $currentStreak++;
            } else {
                $currentStreak = 1;
            }

            $longestStreak = max($longestStreak, $currentStreak);
            $previousDate = $dateStr;
        }

        return $longestStreak;
    }

    public function getTodayProgress(User $user): array
    {
        $today = Carbon::now($user->timezone ?? 'UTC')->toDateString();

        $focuses = $user->dailyFocuses()
            ->with('task:id,status')
            ->where('focus_date', $today)
            ->get();

        $total = $focuses->count();
        $done = $focuses->filter(fn ($f) => $f->task && $f->task->status->value === 'done')->count();

        return [
            'total' => $total,
            'done' => $done,
        ];
    }
}
