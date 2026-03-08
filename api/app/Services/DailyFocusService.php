<?php

namespace App\Services;

use App\Models\DailyFocus;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;

class DailyFocusService
{
    public function listForDate(User $user, ?string $date = null): Collection
    {
        $date = $date ?? Carbon::now($user->timezone)->toDateString();

        return $user->dailyFocuses()
            ->with('task.project')
            ->where('focus_date', $date)
            ->orderBy('sort_order')
            ->get();
    }

    public function create(User $user, array $data): DailyFocus
    {
        $data['user_id'] = $user->id;
        $data['focus_date'] = $data['focus_date'] ?? Carbon::now($user->timezone)->toDateString();

        $existingCount = $user->dailyFocuses()
            ->where('focus_date', $data['focus_date'])
            ->count();

        abort_if($existingCount >= 3, 422, 'Maximum 3 focuses per day.');

        return DailyFocus::create($data)->fresh()->load('task.project');
    }

    public function update(DailyFocus $dailyFocus, array $data): DailyFocus
    {
        $dailyFocus->update($data);
        return $dailyFocus->fresh()->load('task.project');
    }

    public function delete(DailyFocus $dailyFocus): void
    {
        $dailyFocus->delete();
    }

    public function reorder(User $user, string $date, array $order): Collection
    {
        $focuses = $user->dailyFocuses()
            ->where('focus_date', $date)
            ->get()
            ->keyBy('id');

        foreach ($order as $index => $id) {
            if ($focuses->has($id)) {
                $focuses[$id]->update(['sort_order' => $index + 1]);
            }
        }

        return $user->dailyFocuses()
            ->with('task.project')
            ->where('focus_date', $date)
            ->orderBy('sort_order')
            ->get();
    }
}
