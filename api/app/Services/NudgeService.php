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
        'task_due_soon',
        'task_stuck',
        'wip_overload',
        'no_daily_activity',
        'plan_tomorrow',
        'focus_streak',
        'daily_win',
        'welcome_back',
        'overwork_warning',
        'epic_meaning',
        'milestone_progress',
        'outcome_check',
        'reflection_followup',
        'overcommitment',
        'achievement',
        'rest_in_peace',
    ];

    private const ACHIEVEMENT_KEYS = [
        'achievement_first_task',
        'achievement_early_bird',
        'achievement_streak_record',
        'achievement_project_closer',
        'achievement_reflection_master',
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
        'task_due_soon' => [
            1 => "Boo thấy task '{title}' sắp đến hạn ({days} ngày nữa) mà chưa bắt đầu nè~",
            2 => "Task '{title}' chỉ còn {days} ngày... Bạn vẫn chưa start luôn á...",
            3 => "'{title}' sắp due rồi mà vẫn todo... Boo nghĩ bạn đang trốn tránh...",
            4 => "*Boo ngồi đếm ngược cho '{title}'* {days} NGÀY NỮA THÔI! START ĐI!",
        ],
        'task_stuck' => [
            1 => "Boo thấy task '{title}' đang in-progress {days} ngày rồi nè~ Stuck hả?",
            2 => "'{title}' vẫn in-progress... {days} ngày không update... Boo lo lắng...",
            3 => "Task '{title}' stuck {days} ngày rồi... Boo nghĩ nên break nhỏ ra...",
            4 => "*Boo nhìn '{title}' in-progress mãi mà khóc* {days} NGÀY RỒI!",
        ],
        'wip_overload' => [
            1 => 'Bạn đang có {count} task in-progress cùng lúc nè~ Nhiều quá không?',
            2 => '{count} task in-progress... Boo thấy bạn đang ôm hơi nhiều...',
            3 => 'WIP overload! {count} task cùng lúc... Focus vào ít task hơn đi bạn...',
            4 => '*Boo bị ngộp vì {count} task in-progress* FINISH MỘT CÁI ĐI ĐÃ!',
        ],
        'no_daily_activity' => [
            1 => 'Hôm nay Boo chưa thấy bạn update task nào nè~ Bận lắm hả?',
            2 => 'Chiều rồi mà chưa có activity... Boo chờ bạn mãi...',
            3 => 'Cả ngày chưa động vào task... Boo bắt đầu lo bạn bỏ cuộc...',
            4 => '*Boo ngồi nhìn task list trống* LÀM VIỆC ĐI MÀ!',
        ],
        'plan_tomorrow' => [
            1 => 'Boo thấy ngày mai bạn chưa set focus nè~ Plan trước đi!',
            2 => 'Sắp hết ngày rồi mà ngày mai vẫn chưa có plan...',
            3 => 'Không plan = không direction... Boo muốn bạn sẵn sàng cho ngày mai...',
            4 => '*Boo lập kế hoạch giùm nhưng không biết bạn muốn gì* SET FOCUS ĐI!',
        ],
        'focus_streak' => [
            1 => '{days} ngày liên tiếp hoàn thành focus! Streak đang cháy~',
            2 => '{days} ngày streak rồi bạn ơi! Boo tự hào lắm!',
            3 => 'WOW {days} ngày! Consistency game strong!',
            4 => '*Boo đốt pháo hoa* {days} NGÀY STREAK! HUYỀN THOẠI!',
        ],
        'daily_win' => [
            1 => 'Bạn đã hoàn thành hết focus tasks hôm nay! Boo vui quá~',
            2 => 'Daily win! Bạn xong hết rồi! Boo happy lắm!',
            3 => 'YESSS! All focus tasks done! Bạn là legend!',
            4 => '*Boo nhảy múa ăn mừng* DAILY WIN! XUẤT SẮC!',
        ],
        'welcome_back' => [
            1 => 'Boo vui quá bạn quay lại rồi~ Bắt đầu lại nhẹ nhàng nha!',
            2 => 'Bạn đã quay lại! Boo nhớ bạn lắm~ Từ từ thôi nha!',
            3 => 'Welcome back! Boo chờ bạn mãi~ Không vội, bắt đầu từ 1 task nhỏ đi!',
            4 => 'BẠN VỀ RỒI! Boo hạnh phúc quá~ Đừng lo, mọi thứ vẫn ở đây!',
        ],
        'overwork_warning' => [
            1 => 'Boo thấy bạn làm nhiều quá tuần này... Nghỉ ngơi cũng là productivity đó~',
            2 => '{days} ngày liên tiếp làm rất nhiều... Boo lo cho sức khoẻ bạn...',
            3 => 'Bạn ơi, overwork không bền vững... Boo muốn bạn khoẻ hơn là xong nhiều task...',
            4 => '*Boo giấu task list của bạn* NGHỈ NGƠI ĐI MÀ! Boo lo lắm!',
        ],
        'epic_meaning' => [
            1 => "Task '{task}' là 1 bước trong Milestone '{milestone}' → Project '{project}'~ Bạn đang đi đúng hướng!",
            2 => "'{task}' nằm trong Milestone '{milestone}' đó~ Mỗi task nhỏ đều có ý nghĩa!",
            3 => "Boo nhắc nè: '{task}' góp phần vào '{milestone}' → '{project}'~ Đừng quên big picture!",
            4 => "*Boo zoom out cho bạn thấy* '{task}' → '{milestone}' → '{project}'! MEANINGFUL WORK!",
        ],
        'milestone_progress' => [
            1 => "Task xong! Milestone '{milestone}' giờ {done}/{total} ({percent}%)~",
            2 => "Tiến bộ rồi! '{milestone}' đã {percent}%~ Boo vui!",
            3 => "'{milestone}' đang move! {done}/{total} tasks done~",
            4 => "*Boo đếm progress* '{milestone}' {percent}%! KEEP GOING!",
        ],
        'outcome_check' => [
            1 => "Task '{title}' xong rồi~ Kết quả '{outcome}' có đạt không bạn?",
            2 => "Boo tò mò... '{outcome}' cho task '{title}' thế nào rồi?",
            3 => "'{title}' done nhưng outcome '{outcome}' đạt chưa? Boo muốn biết...",
            4 => "*Boo kiểm tra outcome* '{title}' → '{outcome}' → ĐẠT CHƯA?",
        ],
        'reflection_followup' => [
            1 => "Tuần trước bạn viết sẽ cải thiện: '{improvement}'~ Tuần này thế nào rồi?",
            2 => "Boo nhớ bạn nói sẽ '{improvement}'... Bạn có thực hiện không?",
            3 => "'{improvement}' — lời hứa tuần trước... Boo vẫn chờ bạn thực hiện...",
            4 => "*Boo giở lại reflection cũ* BẠN NÓI SẼ '{improvement}'! THẾ NÀO RỒI?",
        ],
        'overcommitment' => [
            1 => 'Bạn có {count} task due hôm nay mà chưa xong... Chọn task quan trọng nhất trước đi~',
            2 => '{count} task cùng due hôm nay... Boo thấy hơi nhiều... Ưu tiên đi bạn...',
            3 => 'Overcommit rồi bạn ơi! {count} task due hôm nay... Boo nghĩ nên reschedule bớt...',
            4 => '*Boo nhìn {count} task due hôm nay mà choáng* CHỌN 3 CÁI THÔI!',
        ],
        'achievement' => [
            1 => '{message}',
            2 => '{message}',
            3 => '{message}',
            4 => '{message}',
        ],
        'rest_in_peace' => [
            1 => "'{name}' hoàn thành! Phần này được giải thoát rồi~ Boo nhẹ nhõm!",
            2 => "'{name}' DONE! Boo vui quá~ Một phần unfinished business đã rest in peace!",
            3 => "Milestone '{name}' xong xuôi! Boo cảm thấy nhẹ hơn rồi~",
            4 => "*Boo siêu thoát* '{name}' HOÀN THÀNH! PEACE AT LAST!",
        ],
    ];

    private const EXPRESSIONS = [
        1 => 'default',
        2 => 'sad',
        3 => 'sad',
        4 => 'dramatic',
    ];

    private const POSITIVE_TYPES = ['focus_streak', 'daily_win', 'welcome_back', 'epic_meaning', 'milestone_progress', 'achievement', 'rest_in_peace'];

    private const STREAK_MILESTONES = [3, 7, 14, 30, 60, 100];

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
        $this->checkTaskDueSoon($user, $now, $dismissals, $nudges);
        $this->checkTaskStuck($user, $now, $dismissals, $nudges);
        $this->checkWipOverload($user, $now, $dismissals, $nudges);
        $this->checkNoDailyActivity($user, $now, $dismissals, $nudges);
        $this->checkPlanTomorrow($user, $now, $dismissals, $nudges);
        $this->checkFocusStreak($user, $now, $dismissals, $nudges);
        $this->checkDailyWin($user, $now, $dismissals, $nudges);
        $this->checkWelcomeBack($user, $now, $dismissals, $nudges);
        $this->checkOverwork($user, $now, $dismissals, $nudges);
        $this->checkEpicMeaning($user, $now, $dismissals, $nudges);
        $this->checkMilestoneProgress($user, $now, $dismissals, $nudges);
        $this->checkOutcomeCheck($user, $now, $dismissals, $nudges);
        $this->checkReflectionFollowup($user, $now, $dismissals, $nudges);
        $this->checkOvercommitment($user, $now, $dismissals, $nudges);
        $this->checkAchievements($user, $now, $dismissals, $nudges);
        $this->checkRestInPeace($user, $now, $dismissals, $nudges);

        $aiNudges = $this->getAiNudges($user, $now);
        $nudges = array_merge($nudges, $aiNudges);

        // Progressive disclosure based on user age
        $userAgeDays = $now->diffInDays(Carbon::parse($user->created_at));
        if ($userAgeDays < 7) {
            // Week 1: only basic nudges
            $allowedTypes = ['no_daily_focus', 'overdue_tasks', 'daily_win', 'focus_streak', 'welcome_back', 'achievement'];
            $nudges = array_values(array_filter($nudges, fn ($n) => in_array($n['type'], $allowedTypes) || str_starts_with($n['type'], 'achievement_')));
        } elseif ($userAgeDays < 14) {
            // Week 2: add planning nudges
            $disallowed = ['task_stuck', 'wip_overload', 'pattern_insight', 'priority_conflict', 'overwork_warning'];
            $nudges = array_values(array_filter($nudges, fn ($n) => ! in_array($n['type'], $disallowed)));
        } elseif ($userAgeDays < 21) {
            // Week 3: add insights, still no AI
            $disallowed = ['pattern_insight', 'priority_conflict'];
            $nudges = array_values(array_filter($nudges, fn ($n) => ! in_array($n['type'], $disallowed)));
        }
        // Week 4+: all nudges

        // Apply safety filters
        $setting = $user->notificationSetting;
        if ($setting) {
            // Weekend mode: on Sat/Sun only show high-priority + positive
            if ($setting->weekend_mode && $now->isWeekend()) {
                $nudges = array_values(array_filter($nudges, fn ($n) => $n['priority'] === 'high' || in_array($n['type'], self::POSITIVE_TYPES)));
            }

            // Gentle mode: cap escalation at level 2
            if ($setting->gentle_mode) {
                $nudges = array_map(function ($n) {
                    if ($n['level'] > 2) {
                        $n['level'] = 2;
                        $n['message'] = $this->getMessage($n['type'], 2);
                        $n['boo_expression'] = in_array($n['type'], self::POSITIVE_TYPES) ? 'happy' : self::EXPRESSIONS[2];
                    }

                    return $n;
                }, $nudges);
            }
        }

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
        $expression = in_array($type, self::POSITIVE_TYPES) ? 'happy' : self::EXPRESSIONS[$level];

        return [
            'type' => $type,
            'priority' => $priority,
            'title' => $title,
            'message' => $this->getMessage($type, $level, $replacements),
            'level' => $level,
            'boo_expression' => $expression,
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

    private function checkTaskDueSoon(User $user, Carbon $now, array $dismissals, array &$nudges): void
    {
        if ($this->isDismissed('task_due_soon', $dismissals)) {
            return;
        }

        $task = $user->tasks()
            ->where('status', 'todo')
            ->whereNotNull('due_date')
            ->whereBetween('due_date', [$now->copy()->addDay()->toDateString(), $now->copy()->addDays(2)->toDateString()])
            ->orderBy('due_date')
            ->first(['id', 'title', 'due_date']);

        if ($task) {
            $days = $now->diffInDays(Carbon::parse($task->due_date));
            $nudges[] = $this->buildNudge(
                $user,
                'task_due_soon',
                'high',
                'Task Due Soon',
                ['title' => $task->title, 'days' => $days],
                ['task_id' => $task->id, 'days_remaining' => $days]
            );
        }
    }

    private function checkTaskStuck(User $user, Carbon $now, array $dismissals, array &$nudges): void
    {
        if ($this->isDismissed('task_stuck', $dismissals)) {
            return;
        }

        $task = $user->tasks()
            ->where('status', 'in_progress')
            ->where('updated_at', '<', $now->copy()->subDays(3))
            ->orderBy('updated_at')
            ->first(['id', 'title', 'updated_at']);

        if ($task) {
            $days = $now->diffInDays(Carbon::parse($task->updated_at));
            $nudges[] = $this->buildNudge(
                $user,
                'task_stuck',
                'medium',
                'Task Stuck',
                ['title' => $task->title, 'days' => $days],
                ['task_id' => $task->id, 'days_stuck' => $days]
            );
        }
    }

    private function checkWipOverload(User $user, Carbon $now, array $dismissals, array &$nudges): void
    {
        if ($this->isDismissed('wip_overload', $dismissals)) {
            return;
        }

        $count = $user->tasks()
            ->where('status', 'in_progress')
            ->count();

        if ($count > 3) {
            $nudges[] = $this->buildNudge($user, 'wip_overload', 'high', 'WIP Overload', ['count' => $count], ['count' => $count]);
        }
    }

    private function checkNoDailyActivity(User $user, Carbon $now, array $dismissals, array &$nudges): void
    {
        if ($this->isDismissed('no_daily_activity', $dismissals)) {
            return;
        }

        if ($now->hour < 14) {
            return;
        }

        $hasActivity = $user->tasks()
            ->where('updated_at', '>=', $now->copy()->startOfDay())
            ->exists();

        if (! $hasActivity) {
            $nudges[] = $this->buildNudge($user, 'no_daily_activity', 'medium', 'No Activity Today');
        }
    }

    private function checkPlanTomorrow(User $user, Carbon $now, array $dismissals, array &$nudges): void
    {
        if ($this->isDismissed('plan_tomorrow', $dismissals)) {
            return;
        }

        if ($now->hour < 20 || ($now->hour === 20 && $now->minute < 30)) {
            return;
        }

        $tomorrow = $now->copy()->addDay()->toDateString();
        $hasFocus = $user->dailyFocuses()
            ->where('focus_date', $tomorrow)
            ->exists();

        if (! $hasFocus) {
            $nudges[] = $this->buildNudge($user, 'plan_tomorrow', 'medium', 'Plan Tomorrow');
        }
    }

    private function checkFocusStreak(User $user, Carbon $now, array $dismissals, array &$nudges): void
    {
        if ($this->isDismissed('focus_streak', $dismissals)) {
            return;
        }

        $streak = (new StreakService)->calculateCurrentStreak($user);

        if (in_array($streak, self::STREAK_MILESTONES)) {
            $nudges[] = $this->buildNudge(
                $user,
                'focus_streak',
                'low',
                'Focus Streak!',
                ['days' => $streak],
                ['streak' => $streak]
            );
        }
    }

    private function checkDailyWin(User $user, Carbon $now, array $dismissals, array &$nudges): void
    {
        if ($this->isDismissed('daily_win', $dismissals)) {
            return;
        }

        $focuses = $user->dailyFocuses()
            ->where('focus_date', $now->toDateString())
            ->with('task:id,status')
            ->get();

        if ($focuses->isEmpty()) {
            return;
        }

        $allDone = $focuses->every(fn ($f) => $f->task && $f->task->status->value === 'done');

        if ($allDone) {
            $nudges[] = $this->buildNudge($user, 'daily_win', 'low', 'Daily Win!');
        }
    }

    private function checkWelcomeBack(User $user, Carbon $now, array $dismissals, array &$nudges): void
    {
        if ($this->isDismissed('welcome_back', $dismissals)) {
            return;
        }

        $todayStr = $now->toDateString();

        // Check latest task activity and latest daily focus before today
        $latestTaskUpdate = $user->tasks()->where('updated_at', '<', $now->copy()->startOfDay())->max('updated_at');
        $latestFocusDate = $user->dailyFocuses()->where('focus_date', '<', $todayStr)->max('focus_date');

        $lastActivity = null;
        if ($latestTaskUpdate) {
            $lastActivity = Carbon::parse($latestTaskUpdate);
        }
        if ($latestFocusDate) {
            $focusDate = Carbon::parse($latestFocusDate);
            $lastActivity = $lastActivity ? max($lastActivity, $focusDate) : $focusDate;
        }

        // No previous activity at all, or gap < 5 days → not a return
        if (! $lastActivity || $now->copy()->startOfDay()->diffInDays($lastActivity->copy()->startOfDay()) < 5) {
            return;
        }

        // Check if user has activity today (task updated or daily focus set)
        $hasActivityToday = $user->tasks()->where('updated_at', '>=', $now->copy()->startOfDay())->exists()
            || $user->dailyFocuses()->where('focus_date', $todayStr)->exists();

        if (! $hasActivityToday) {
            return;
        }

        // Clear all nudge dismissals for a fresh start
        DB::table('nudge_dismissals')->where('user_id', $user->id)->delete();

        $nudges[] = $this->buildNudge($user, 'welcome_back', 'high', 'Welcome Back!');
    }

    private function checkOverwork(User $user, Carbon $now, array $dismissals, array &$nudges): void
    {
        if ($this->isDismissed('overwork_warning', $dismissals)) {
            return;
        }

        $consecutiveHighDays = 0;
        $consecutiveLateDays = 0;

        // Check up to 7 days back from yesterday
        for ($i = 1; $i <= 7; $i++) {
            $date = $now->copy()->subDays($i);
            $dateStr = $date->toDateString();

            $doneCount = $user->tasks()
                ->where('status', 'done')
                ->whereDate('completed_at', $dateStr)
                ->count();

            if ($doneCount > 8) {
                $consecutiveHighDays++;
            } else {
                break;
            }
        }

        // Check late-night work (after 23:00) for consecutive days
        if ($consecutiveHighDays < 3) {
            $consecutiveLateDays = 0;
            for ($i = 1; $i <= 7; $i++) {
                $date = $now->copy()->subDays($i);
                $dayStart = $date->copy()->setTime(23, 0, 0);
                $dayEnd = $date->copy()->addDay()->startOfDay();

                $lateCount = $user->tasks()
                    ->where('status', 'done')
                    ->whereBetween('completed_at', [$dayStart, $dayEnd])
                    ->count();

                if ($lateCount > 0) {
                    $consecutiveLateDays++;
                } else {
                    break;
                }
            }
        }

        $days = max($consecutiveHighDays, $consecutiveLateDays);

        if ($days >= 3) {
            $nudges[] = $this->buildNudge(
                $user,
                'overwork_warning',
                'medium',
                'Overwork Warning',
                ['days' => $days],
                ['consecutive_days' => $days]
            );
        }
    }

    private function checkEpicMeaning(User $user, Carbon $now, array $dismissals, array &$nudges): void
    {
        if ($this->isDismissed('epic_meaning', $dismissals)) {
            return;
        }

        $focusTask = $user->dailyFocuses()
            ->where('focus_date', $now->toDateString())
            ->with(['task' => fn ($q) => $q->whereNotNull('milestone_id')->with(['milestone.project'])])
            ->get()
            ->pluck('task')
            ->filter()
            ->filter(fn ($t) => $t->milestone_id)
            ->first();

        if (! $focusTask || ! $focusTask->milestone || ! $focusTask->milestone->project) {
            return;
        }

        $nudges[] = $this->buildNudge(
            $user,
            'epic_meaning',
            'low',
            'Epic Meaning',
            [
                'task' => $focusTask->title,
                'milestone' => $focusTask->milestone->title,
                'project' => $focusTask->milestone->project->title,
            ],
            [
                'task_id' => $focusTask->id,
                'milestone_id' => $focusTask->milestone_id,
                'project_id' => $focusTask->milestone->project_id,
            ]
        );
    }

    private function checkMilestoneProgress(User $user, Carbon $now, array $dismissals, array &$nudges): void
    {
        if ($this->isDismissed('milestone_progress', $dismissals)) {
            return;
        }

        $task = $user->tasks()
            ->where('status', 'done')
            ->whereDate('completed_at', $now->toDateString())
            ->whereNotNull('milestone_id')
            ->with('milestone')
            ->first();

        if (! $task || ! $task->milestone) {
            return;
        }

        $total = $user->tasks()->where('milestone_id', $task->milestone_id)->count();
        $done = $user->tasks()->where('milestone_id', $task->milestone_id)->where('status', 'done')->count();
        $percent = $total > 0 ? round(($done / $total) * 100) : 0;

        $nudges[] = $this->buildNudge(
            $user,
            'milestone_progress',
            'low',
            'Milestone Progress',
            [
                'milestone' => $task->milestone->title,
                'done' => $done,
                'total' => $total,
                'percent' => $percent,
            ],
            [
                'milestone_id' => $task->milestone_id,
                'done' => $done,
                'total' => $total,
                'percent' => $percent,
            ]
        );
    }

    private function checkOutcomeCheck(User $user, Carbon $now, array $dismissals, array &$nudges): void
    {
        if ($this->isDismissed('outcome_check', $dismissals)) {
            return;
        }

        $task = $user->tasks()
            ->where('status', 'done')
            ->whereDate('completed_at', $now->toDateString())
            ->whereNotNull('expected_outcome')
            ->where('expected_outcome', '!=', '')
            ->first(['id', 'title', 'expected_outcome']);

        if (! $task) {
            return;
        }

        $nudges[] = $this->buildNudge(
            $user,
            'outcome_check',
            'medium',
            'Outcome Check',
            ['title' => $task->title, 'outcome' => $task->expected_outcome],
            ['task_id' => $task->id]
        );
    }

    private function checkReflectionFollowup(User $user, Carbon $now, array $dismissals, array &$nudges): void
    {
        if ($this->isDismissed('reflection_followup', $dismissals)) {
            return;
        }

        if (! $now->isMonday()) {
            return;
        }

        $lastReflection = $user->reflections()
            ->where('type', 'weekly')
            ->orderBy('period_start', 'desc')
            ->first(['id', 'to_improve']);

        if (! $lastReflection || empty($lastReflection->to_improve)) {
            return;
        }

        $nudges[] = $this->buildNudge(
            $user,
            'reflection_followup',
            'medium',
            'Reflection Follow-up',
            ['improvement' => $lastReflection->to_improve],
            ['reflection_id' => $lastReflection->id]
        );
    }

    private function checkOvercommitment(User $user, Carbon $now, array $dismissals, array &$nudges): void
    {
        if ($this->isDismissed('overcommitment', $dismissals)) {
            return;
        }

        $count = $user->tasks()
            ->where('due_date', $now->toDateString())
            ->whereNotIn('status', ['done', 'cancelled'])
            ->count();

        if ($count > 5) {
            $nudges[] = $this->buildNudge($user, 'overcommitment', 'high', 'Overcommitment', ['count' => $count], ['count' => $count]);
        }
    }

    private function checkAchievements(User $user, Carbon $now, array $dismissals, array &$nudges): void
    {
        $achievements = [
            'achievement_first_task' => [
                'check' => fn () => $user->tasks()->where('status', 'done')->exists(),
                'message' => 'Task đầu tiên xong! Hành trình bắt đầu từ đây~',
            ],
            'achievement_early_bird' => [
                'check' => fn () => $user->tasks()->where('status', 'done')
                    ->whereNotNull('completed_at')
                    ->whereRaw("EXTRACT(HOUR FROM completed_at) < 8")->exists(),
                'message' => 'Bạn dậy sớm làm task! Boo impressed~',
            ],
            'achievement_streak_record' => [
                'check' => function () use ($user) {
                    $streakService = new StreakService;
                    $current = $streakService->calculateCurrentStreak($user);
                    $longest = $streakService->calculateLongestStreak($user);

                    return $current > 0 && $current >= $longest;
                },
                'message' => 'KỶ LỤC MỚI! Streak vượt record cũ rồi!',
            ],
            'achievement_project_closer' => [
                'check' => fn () => $user->projects()->where('status', 'completed')->exists(),
                'message' => 'Project đầu tiên hoàn thành! Boo được giải thoát 1 phần~',
            ],
            'achievement_reflection_master' => [
                'check' => fn () => $this->hasConsecutiveReflections($user, 4),
                'message' => '4 tuần reflect liên tiếp! Self-awareness level up~',
            ],
        ];

        foreach ($achievements as $key => $achievement) {
            if (in_array($key, $dismissals)) {
                continue;
            }
            if (($achievement['check'])()) {
                $nudges[] = [
                    'type' => $key,
                    'priority' => 'low',
                    'title' => 'Achievement Unlocked!',
                    'message' => $achievement['message'],
                    'level' => 1,
                    'boo_expression' => 'happy',
                    'data' => null,
                ];

                return; // Only 1 achievement at a time
            }
        }
    }

    private function hasConsecutiveReflections(User $user, int $count): bool
    {
        $reflections = $user->reflections()
            ->where('type', 'weekly')
            ->orderBy('period_start', 'desc')
            ->take($count)
            ->pluck('period_start')
            ->map(fn ($d) => Carbon::parse($d));

        if ($reflections->count() < $count) {
            return false;
        }

        // Check if they are consecutive weeks
        for ($i = 0; $i < $count - 1; $i++) {
            $diff = $reflections[$i]->diffInDays($reflections[$i + 1]);
            if ($diff !== 7) {
                return false;
            }
        }

        return true;
    }

    private function checkRestInPeace(User $user, Carbon $now, array $dismissals, array &$nudges): void
    {
        if ($this->isDismissed('rest_in_peace', $dismissals)) {
            return;
        }

        $todayStr = $now->toDateString();

        // Check milestones completed today
        $milestone = $user->tasks()
            ->whereNotNull('milestone_id')
            ->with('milestone')
            ->get()
            ->pluck('milestone')
            ->filter()
            ->unique('id')
            ->filter(fn ($m) => $m->status === 'completed' && $m->updated_at && $m->updated_at->toDateString() === $todayStr)
            ->first();

        if ($milestone) {
            $nudges[] = $this->buildNudge(
                $user,
                'rest_in_peace',
                'low',
                'Rest In Peace!',
                ['name' => $milestone->title],
                ['milestone_id' => $milestone->id]
            );

            return;
        }

        // Check projects completed today
        $project = $user->projects()
            ->where('status', 'completed')
            ->whereDate('updated_at', $todayStr)
            ->first(['id', 'title']);

        if ($project) {
            $nudges[] = $this->buildNudge(
                $user,
                'rest_in_peace',
                'low',
                'Rest In Peace!',
                ['name' => $project->title],
                ['project_id' => $project->id]
            );
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
        if (str_starts_with($nudgeType, 'achievement_')) {
            return now()->addYears(10);
        }

        return match ($nudgeType) {
            'no_daily_focus', 'overdue_tasks', 'incomplete_focus',
            'no_weekly_plan', 'no_weekly_reflection', 'goal_deadline',
            'task_due_soon', 'wip_overload', 'no_daily_activity',
            'plan_tomorrow', 'daily_win', 'epic_meaning' => now()->addDay(),
            'task_stuck' => now()->addDays(2),
            'overwork_warning' => now()->addDays(3),
            'milestone_progress' => now()->addHours(12),
            'focus_streak' => now()->addWeek(),
            'no_monthly_reflection', 'stale_project', 'ideas_aging' => now()->addWeek(),
            'outcome_check', 'reflection_followup' => now()->addWeek(),
            'overcommitment' => now()->addDay(),
            'rest_in_peace' => now()->addMonth(),
            'welcome_back' => now()->addMonth(),
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
        return array_merge(self::NUDGE_TYPES, self::AI_NUDGE_TYPES, self::ACHIEVEMENT_KEYS);
    }
}
