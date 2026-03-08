<?php

namespace App\Policies;

use App\Models\DailyFocus;
use App\Models\User;

class DailyFocusPolicy
{
    public function view(User $user, DailyFocus $dailyFocus): bool
    {
        return $user->id === $dailyFocus->user_id;
    }

    public function update(User $user, DailyFocus $dailyFocus): bool
    {
        return $user->id === $dailyFocus->user_id;
    }

    public function delete(User $user, DailyFocus $dailyFocus): bool
    {
        return $user->id === $dailyFocus->user_id;
    }
}
