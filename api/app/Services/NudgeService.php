<?php

namespace App\Services;

use App\Ai\Agents\NudgeAnalysisAgent;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class NudgeService
{
    private const NUDGE_TYPES = [
        'no_daily_focus',
        'overdue_tasks',
        'incomplete_focus',
        'no_weekly_plan',
        'no_weekly_reflection',
        'no_monthly_reflection',
        'stale_project',
        'goal_deadline',
        'ideas_aging',
    ];

    private const AI_NUDGE_TYPES = [
        'pattern_insight',
        'priority_conflict',
    ];

    private const MESSAGES = [
        'no_daily_focus' => [
            1 => 'Boo thấy hôm nay bạn chưa set focus nè~ Chọn 3 task quan trọng nhất đi!',
            2 => 'Ơ bạn ơi, hôm qua cũng chưa set focus luôn... Boo lo quá...',
            3 => '3 ngày không set focus rồi... Boo bắt đầu nghĩ bạn quên Boo thật rồi...',
            4 => '*Boo ngồi trong góc tối, ôm danh sách task của bạn khóc* SET FOCUS ĐI MÀ!',
        ],
        'overdue_tasks' => [
            1 => 'Boo phát hiện {count} task quá hạn nè~ Xử lý đi bạn!',
            2 => 'Mấy task overdue vẫn còn đó... Boo đếm lại rồi, {count} task luôn á...',
            3 => 'Boo biết hết đó... {count} task overdue mà bạn vẫn giả vờ không thấy...',
            4 => '*Boo haunt mấy cái task overdue này vào giấc mơ bạn luôn* {count} TASK!',
        ],
        'incomplete_focus' => [
            1 => 'Hôm nay bạn set focus rồi nhưng chưa xong hết nè~ Cố lên!',
            2 => 'Focus set rồi mà chưa done... Boo chờ bạn hoàn thành...',
            3 => 'Boo thấy bạn hay set focus mà không finish... pattern này hơi đáng lo...',
            4 => '*Boo nhìn mấy cái focus chưa done rồi thở dài* Nói thiệt nha...',
        ],
        'no_weekly_plan' => [
            1 => 'Tuần này bạn chưa viết weekly plan nè~ Lên kế hoạch đi!',
            2 => 'Giữa tuần rồi mà chưa có plan... Boo thấy bạn đang drift...',
            3 => 'Không có plan = không có hướng... Boo sợ bạn bị lạc...',
            4 => '*Boo cầm compass chỉ đường cho bạn nhưng bạn không nhìn* PLAN ĐI!',
        ],
        'no_weekly_reflection' => [
            1 => 'Tuần trước qua rồi mà bạn chưa reflect nè~ Nhìn lại chút đi!',
            2 => 'Boo vẫn chờ bạn viết reflection tuần trước...',
            3 => 'Không reflect = không học được gì... Boo buồn...',
            4 => '*Boo lật từng trang nhật ký trống của bạn* REFLECT ĐI MÀ!',
        ],
        'no_monthly_reflection' => [
            1 => 'Tháng mới rồi~ Bạn chưa reflect tháng trước nè!',
            2 => 'Boo nhắc lần 2... monthly reflection còn trống...',
            3 => 'Cả tháng qua bạn làm gì? Boo muốn biết mà bạn không viết...',
            4 => '*Boo biến thành accountant kiểm tra sổ sách tháng của bạn* VIẾT ĐI!',
        ],
        'stale_project' => [
            1 => "Boo thấy project '{name}' im lặng 2 tuần rồi nè~ Còn làm không?",
            2 => "Project '{name}' vẫn chưa có activity... Boo bắt đầu lo...",
            3 => "'{name}' bị bỏ quên rồi sao? Boo nhớ hồi xưa bạn hào hứng lắm mà...",
            4 => "*Boo ngồi trên project '{name}' phủ bụi* Nó vẫn chờ bạn đó...",
        ],
        'goal_deadline' => [
            1 => "Goal '{title}' sắp đến deadline rồi nè~ {days} ngày nữa thôi!",
            2 => "Boo đếm ngược... {days} ngày cho '{title}'... Bạn sẵn sàng chưa?",
            3 => "'{title}' gần lắm rồi mà Boo chưa thấy progress... Boo lo...",
            4 => "*Boo cầm đồng hồ đếm ngược cho '{title}'* {days} NGÀY!",
        ],
        'ideas_aging' => [
            1 => 'Boo thấy có mấy idea nằm trong inbox hơn 2 tuần rồi~ Xem lại đi!',
            2 => 'Mấy idea cũ vẫn inbox... Convert hay discard đi bạn...',
            3 => 'Ideas cũ chồng chất... Boo sợ inbox thành graveyard...',
            4 => '*Boo dọn dẹp inbox ideas cho bạn... à không, bạn phải tự làm* XỬ LÝ ĐI!',
        ],
    ];

    private const EXPRESSIONS = [
        1 => 'default',
        2 => 'sad',
        3 => 'sad',
        4 => 'dramatic',
    ];

    public function getNudges(User $user): array
    {
        $dismissals = $this->getActiveDismissals($user);
        $nudges = [];

        $now = Carbon::now($user->timezone ?? 'UTC');

        $this->checkNoDailyFocus($user, $now, $dismissals, $nudges);
        $this->checkOverdueTasks($user, $now, $dismissals, $nudges);
        $this->checkIncompleteFocus($user, $now, $dismissals, $nudges);
        $this->checkNoWeeklyPlan($user, $now, $dismissals, $nudges);
        $this->checkNoWeeklyReflection($user, $now, $dismissals, $nudges);
        $this->checkNoMonthlyReflection($user, $now, $dismissals, $nudges);
        $this->checkStaleProjects($user, $now, $dismissals, $nudges);
        $this->checkGoalDeadlines($user, $now, $dismissals, $nudges);
        $this->checkIdeasAging($user, $now, $dismissals, $nudges);

        $aiNudges = $this->getAiNudges($user, $now);
        $nudges = array_merge($nudges, $aiNudges);

        usort($nudges, fn ($a, $b) => $this->priorityWeight($a['priority']) <=> $this->priorityWeight($b['priority']));

        return $nudges;
    }

    public function dismiss(User $user, string $nudgeType): void
    {
        $expiresAt = $this->getReShowTime($nudgeType);

        DB::table('nudge_dismissals')->insert([
            'user_id' => $user->id,
            'nudge_type' => $nudgeType,
            'dismissed_at' => now(),
            'expires_at' => $expiresAt,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    private function getActiveDismissals(User $user): array
    {
        return DB::table('nudge_dismissals')
            ->where('user_id', $user->id)
            ->where('expires_at', '>', now())
            ->pluck('nudge_type')
            ->toArray();
    }

    private function getDismissalCount(User $user, string $nudgeType): int
    {
        return DB::table('nudge_dismissals')
            ->where('user_id', $user->id)
            ->where('nudge_type', $nudgeType)
            ->count();
    }

    private function getLevel(User $user, string $nudgeType): int
    {
        $count = $this->getDismissalCount($user, $nudgeType);

        return min($count + 1, 4);
    }

    private function getMessage(string $type, int $level, array $replacements = []): string
    {
        $message = self::MESSAGES[$type][$level] ?? self::MESSAGES[$type][1];

        foreach ($replacements as $key => $value) {
            $message = str_replace("{{$key}}", $value, $message);
        }

        return $message;
    }

    private function buildNudge(User $user, string $type, string $priority, string $title, array $replacements = [], array $data = []): array
    {
        $level = $this->getLevel($user, $type);

        return [
            'type' => $type,
            'priority' => $priority,
            'title' => $title,
            'message' => $this->getMessage($type, $level, $replacements),
            'level' => $level,
            'boo_expression' => self::EXPRESSIONS[$level],
            'data' => $data ?: null,
        ];
    }

    private function isDismissed(string $type, array $dismissals): bool
    {
        return in_array($type, $dismissals);
    }

    private function checkNoDailyFocus(User $user, Carbon $now, array $dismissals, array &$nudges): void
    {
        if ($this->isDismissed('no_daily_focus', $dismissals)) {
            return;
        }

        $hasFocus = $user->dailyFocuses()
            ->where('focus_date', $now->toDateString())
            ->exists();

        if (! $hasFocus) {
            $nudges[] = $this->buildNudge($user, 'no_daily_focus', 'high', 'Set Daily Focus');
        }
    }

    private function checkOverdueTasks(User $user, Carbon $now, array $dismissals, array &$nudges): void
    {
        if ($this->isDismissed('overdue_tasks', $dismissals)) {
            return;
        }

        $count = $user->tasks()
            ->where('due_date', '<', $now->toDateString())
            ->whereNotIn('status', ['done', 'cancelled'])
            ->count();

        if ($count > 0) {
            $nudges[] = $this->buildNudge($user, 'overdue_tasks', 'high', 'Overdue Tasks', ['count' => $count], ['count' => $count]);
        }
    }

    private function checkIncompleteFocus(User $user, Carbon $now, array $dismissals, array &$nudges): void
    {
        if ($this->isDismissed('incomplete_focus', $dismissals)) {
            return;
        }

        if ($now->hour < 18) {
            return;
        }

        $focuses = $user->dailyFocuses()
            ->where('focus_date', $now->toDateString())
            ->with('task:id,status')
            ->get();

        if ($focuses->isEmpty()) {
            return;
        }

        $incomplete = $focuses->filter(fn ($f) => $f->task && $f->task->status->value !== 'done');

        if ($incomplete->isNotEmpty()) {
            $nudges[] = $this->buildNudge($user, 'incomplete_focus', 'medium', 'Incomplete Focus Tasks');
        }
    }

    private function checkNoWeeklyPlan(User $user, Carbon $now, array $dismissals, array &$nudges): void
    {
        if ($this->isDismissed('no_weekly_plan', $dismissals)) {
            return;
        }

        if ($now->dayOfWeek < Carbon::WEDNESDAY) {
            return;
        }

        $weekStart = $now->copy()->startOfWeek(Carbon::MONDAY)->toDateString();
        $hasPlan = $user->weeklyPlans()->where('week_start', $weekStart)->exists();

        if (! $hasPlan) {
            $nudges[] = $this->buildNudge($user, 'no_weekly_plan', 'medium', 'Weekly Plan Missing');
        }
    }

    private function checkNoWeeklyReflection(User $user, Carbon $now, array $dismissals, array &$nudges): void
    {
        if ($this->isDismissed('no_weekly_reflection', $dismissals)) {
            return;
        }

        if ($now->dayOfWeek < Carbon::MONDAY) {
            return;
        }

        $lastWeekStart = $now->copy()->subWeek()->startOfWeek(Carbon::MONDAY)->toDateString();
        $lastWeekEnd = $now->copy()->subWeek()->endOfWeek(Carbon::SUNDAY)->toDateString();

        $hasReflection = $user->reflections()
            ->where('type', 'weekly')
            ->where('period_start', $lastWeekStart)
            ->exists();

        if (! $hasReflection) {
            $nudges[] = $this->buildNudge($user, 'no_weekly_reflection', 'medium', 'Weekly Reflection Missing');
        }
    }

    private function checkNoMonthlyReflection(User $user, Carbon $now, array $dismissals, array &$nudges): void
    {
        if ($this->isDismissed('no_monthly_reflection', $dismissals)) {
            return;
        }

        if ($now->day < 3) {
            return;
        }

        $lastMonthStart = $now->copy()->subMonth()->startOfMonth()->toDateString();

        $hasReflection = $user->reflections()
            ->where('type', 'monthly')
            ->where('period_start', $lastMonthStart)
            ->exists();

        if (! $hasReflection) {
            $nudges[] = $this->buildNudge($user, 'no_monthly_reflection', 'low', 'Monthly Reflection Missing');
        }
    }

    private function checkStaleProjects(User $user, Carbon $now, array $dismissals, array &$nudges): void
    {
        if ($this->isDismissed('stale_project', $dismissals)) {
            return;
        }

        $staleProjects = $user->projects()
            ->where('status', 'active')
            ->whereDoesntHave('tasks', fn ($q) => $q->where('updated_at', '>=', $now->copy()->subDays(14)))
            ->get(['id', 'title']);

        foreach ($staleProjects as $project) {
            $nudges[] = $this->buildNudge(
                $user,
                'stale_project',
                'low',
                'Stale Project',
                ['name' => $project->title],
                ['project_id' => $project->id, 'project_title' => $project->title]
            );
        }
    }

    private function checkGoalDeadlines(User $user, Carbon $now, array $dismissals, array &$nudges): void
    {
        if ($this->isDismissed('goal_deadline', $dismissals)) {
            return;
        }

        $goals = $user->goals()
            ->where('status', 'active')
            ->whereNotNull('target_date')
            ->whereBetween('target_date', [$now->toDateString(), $now->copy()->addDays(7)->toDateString()])
            ->get(['id', 'title', 'target_date']);

        foreach ($goals as $goal) {
            $days = $now->diffInDays(Carbon::parse($goal->target_date));
            $nudges[] = $this->buildNudge(
                $user,
                'goal_deadline',
                'medium',
                'Goal Deadline Approaching',
                ['title' => $goal->title, 'days' => $days],
                ['goal_id' => $goal->id, 'days_remaining' => $days]
            );
        }
    }

    private function checkIdeasAging(User $user, Carbon $now, array $dismissals, array &$nudges): void
    {
        if ($this->isDismissed('ideas_aging', $dismissals)) {
            return;
        }

        $count = $user->ideas()
            ->where('status', 'inbox')
            ->where('created_at', '<', $now->copy()->subDays(14))
            ->count();

        if ($count > 0) {
            $nudges[] = $this->buildNudge($user, 'ideas_aging', 'low', 'Aging Ideas', [], ['count' => $count]);
        }
    }

    private function getAiNudges(User $user, Carbon $now): array
    {
        $nudges = [];

        // Pattern insight - weekly on Monday
        if ($now->isMonday()) {
            $cached = Cache::get("nudge_ai_{$user->id}_pattern_insight");

            if (! $cached) {
                try {
                    $cached = $this->generatePatternInsight($user, $now);
                    Cache::put("nudge_ai_{$user->id}_pattern_insight", $cached, now()->addDays(7));
                } catch (\Throwable) {
                    $cached = null;
                }
            }

            if ($cached) {
                $nudges[] = $cached;
            }
        }

        // Priority conflict - daily when 2+ high tasks share due date
        $conflictCache = Cache::get("nudge_ai_{$user->id}_priority_conflict");

        if (! $conflictCache) {
            $highTasksSameDue = $user->tasks()
                ->where('status', '!=', 'done')
                ->where('status', '!=', 'cancelled')
                ->where('priority', 'high')
                ->whereNotNull('due_date')
                ->get(['id', 'title', 'due_date'])
                ->groupBy(fn ($t) => $t->due_date->toDateString())
                ->filter(fn ($group) => $group->count() >= 2);

            if ($highTasksSameDue->isNotEmpty()) {
                try {
                    $conflictCache = $this->generatePriorityConflict($user, $highTasksSameDue);
                    Cache::put("nudge_ai_{$user->id}_priority_conflict", $conflictCache, now()->addDay());
                } catch (\Throwable) {
                    $conflictCache = null;
                }
            }
        }

        if ($conflictCache) {
            $nudges[] = $conflictCache;
        }

        return $nudges;
    }

    private function generatePatternInsight(User $user, Carbon $now): ?array
    {
        $start = $now->copy()->subWeeks(2);
        $end = $now->copy();

        $tasksByDay = $user->tasks()
            ->where('status', 'done')
            ->whereBetween('completed_at', [$start, $end])
            ->get(['id', 'title', 'completed_at'])
            ->groupBy(fn ($t) => $t->completed_at->format('l'));

        $focusByDay = $user->dailyFocuses()
            ->whereBetween('focus_date', [$start->toDateString(), $end->toDateString()])
            ->with('task:id,status')
            ->get();

        $prompt = "Analyze this user's 2-week work pattern:\n"
            . "Tasks completed by day: " . $tasksByDay->map(fn ($tasks, $day) => "$day: {$tasks->count()}")->implode(', ') . "\n"
            . "Daily focuses set: {$focusByDay->count()}, completed: " . $focusByDay->filter(fn ($f) => $f->task?->status?->value === 'done')->count() . "\n"
            . "Give 1 short insight about their pattern, in Vietnamese with Boo personality.";

        $response = (new NudgeAnalysisAgent)->prompt($prompt);

        $insights = $response['insights'] ?? [];

        if (empty($insights)) {
            return null;
        }

        $insight = $insights[0];

        return [
            'type' => 'pattern_insight',
            'priority' => $insight['priority'] ?? 'low',
            'title' => 'Pattern Insight',
            'message' => $insight['message'],
            'level' => 1,
            'boo_expression' => 'spooky',
            'data' => null,
        ];
    }

    private function generatePriorityConflict(User $user, $conflictGroups): ?array
    {
        $prompt = "These high-priority tasks have the same due date:\n";

        foreach ($conflictGroups as $date => $tasks) {
            $prompt .= "Due $date: " . $tasks->pluck('title')->implode(', ') . "\n";
        }

        $prompt .= "Give 1 short suggestion about prioritization, in Vietnamese with Boo personality.";

        $response = (new NudgeAnalysisAgent)->prompt($prompt);

        $insights = $response['insights'] ?? [];

        if (empty($insights)) {
            return null;
        }

        $insight = $insights[0];

        return [
            'type' => 'priority_conflict',
            'priority' => $insight['priority'] ?? 'medium',
            'title' => 'Priority Conflict',
            'message' => $insight['message'],
            'level' => 1,
            'boo_expression' => 'spooky',
            'data' => null,
        ];
    }

    private function getReShowTime(string $nudgeType): Carbon
    {
        return match ($nudgeType) {
            'no_daily_focus', 'overdue_tasks', 'incomplete_focus',
            'no_weekly_plan', 'no_weekly_reflection', 'goal_deadline' => now()->addDay(),
            'no_monthly_reflection', 'stale_project', 'ideas_aging' => now()->addWeek(),
            default => now()->addDay(),
        };
    }

    private function priorityWeight(string $priority): int
    {
        return match ($priority) {
            'high' => 1,
            'medium' => 2,
            'low' => 3,
            default => 4,
        };
    }

    public static function validTypes(): array
    {
        return array_merge(self::NUDGE_TYPES, self::AI_NUDGE_TYPES);
    }
}
