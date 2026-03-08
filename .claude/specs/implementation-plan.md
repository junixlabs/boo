# LifeStack - Implementation Plan

## Phase 1 - MVP (Core Daily Operations) -- COMPLETE

### 1.1 Backend Setup
- [x] Init Laravel project
- [x] Configure PostgreSQL connection
- [x] Setup JWT Auth (php-open-source-saver/jwt-auth)
- [x] Setup API versioning (route prefix /api/v1)
- [x] Configure CORS for SPA
- [x] Enums (ProjectType, ProjectStatus, TaskStatus, TaskPriority, IdeaStatus)
- [x] Global error handling (bootstrap/app.php: 404, 403, 401)
- [x] ApiResponse trait (success, created, noContent)

### 1.2 Auth Module
- [x] Create User migration (add timezone column)
- [x] POST /auth/register
- [x] POST /auth/login
- [x] POST /auth/logout
- [x] POST /auth/refresh
- [x] GET /auth/me
- [x] PUT /auth/profile
- [x] Auth middleware setup (redirectGuestsTo returns null for api/*)

### 1.3 Projects Module
- [x] Create projects migration (with soft deletes)
- [x] Project model + enums + query scopes (filterByStatus, filterByType)
- [x] ProjectPolicy (view, update, delete)
- [x] GET /projects (with filters: status, type, sort, pagination)
- [x] POST /projects
- [x] GET /projects/{id} (with tasks_count, tasks_done_count)
- [x] PUT /projects/{id}
- [x] DELETE /projects/{id} (soft delete)
- [x] PATCH /projects/{id}/status
- [x] FormRequest: StoreProjectRequest, UpdateProjectRequest, UpdateProjectStatusRequest
- [x] ProjectResource

### 1.4 Tasks Module
- [x] Create tasks migration
- [x] Task model + enums + query scopes (filterByProject, filterByStatus, filterByPriority, dueBetween)
- [x] TaskPolicy (view, update, delete)
- [x] GET /tasks (with filters: project_id, status, priority, due_date_from/to, pagination)
- [x] POST /tasks
- [x] GET /tasks/{id} (with project relation)
- [x] PUT /tasks/{id}
- [x] PATCH /tasks/{id}/status (auto completed_at)
- [x] DELETE /tasks/{id}
- [x] FormRequest: StoreTaskRequest, UpdateTaskRequest, UpdateTaskStatusRequest
- [x] TaskResource (includes is_focused_today, project relation)

### 1.5 Daily Focus Module
- [x] Create daily_focuses migration
- [x] DailyFocus model (custom $table = 'daily_focuses')
- [x] DailyFocusPolicy
- [x] GET /daily-focus?date= (default today)
- [x] POST /daily-focus (max 3 validation)
- [x] PUT /daily-focus/{id}
- [x] DELETE /daily-focus/{id}
- [x] POST /daily-focus/reorder
- [x] FormRequest: StoreDailyFocusRequest, UpdateDailyFocusRequest, ReorderDailyFocusRequest
- [x] DailyFocusResource

### 1.6 Ideas Module
- [x] Create ideas migration
- [x] Idea model + IdeaStatus enum
- [x] IdeaPolicy
- [x] GET /ideas (with filters: status, category)
- [x] POST /ideas
- [x] PUT /ideas/{id}
- [x] DELETE /ideas/{id}
- [x] POST /ideas/{id}/convert (to project or task)
- [x] PATCH /ideas/{id}/discard
- [x] FormRequest: StoreIdeaRequest, UpdateIdeaRequest, ConvertIdeaRequest
- [x] IdeaResource

### 1.7 Dashboard
- [x] GET /dashboard/today (daily_focuses, active_projects, overdue_tasks, recent_ideas_count, tasks_completed_this_week)
- [x] DashboardService (timezone-aware)

### 1.8 API Documentation
- [x] Install and configure Scramble (dedoc/scramble)
- [x] Install Scalar UI (scalar/laravel)
- [x] Auto-generated docs at /docs/api
- [x] OpenAPI JSON at /docs/api.json

### 1.9 Frontend
- [x] Complete (Feature-Based architecture, all modules built, drag & drop reorder)

**Phase 1 Summary: 30 routes, 38 tests passing, 6 controllers, 12 FormRequests, 5 Resources, 5 Services, 5 Models, 4 Policies, 5 Enums**

---

## Phase 2 - Planning & Direction -- COMPLETE

### 2.1 Life Direction Module
- [x] Create life_directions migration
- [x] LifeDirection model (1:1 with user, upsert pattern)
- [x] GET /life-direction (aggregate: vision + goals + focus_areas)
- [x] PUT /life-direction/vision

### 2.2 Goals Module
- [x] Create goals migration
- [x] Goal model + GoalTimeframe enum + GoalStatus enum
- [x] GoalPolicy
- [x] GET /goals (filters: timeframe, status)
- [x] POST /goals
- [x] PUT /goals/{id}
- [x] DELETE /goals/{id}
- [x] FormRequest: StoreGoalRequest, UpdateGoalRequest
- [x] GoalResource

### 2.3 Focus Areas Module
- [x] Create focus_areas migration
- [x] FocusArea model
- [x] FocusAreaPolicy
- [x] GET /focus-areas (filter: is_active)
- [x] POST /focus-areas
- [x] PUT /focus-areas/{id}
- [x] DELETE /focus-areas/{id}
- [x] FormRequest: StoreFocusAreaRequest, UpdateFocusAreaRequest
- [x] FocusAreaResource

### 2.4 Milestones Module
- [x] Create milestones migration + milestone FK on tasks
- [x] Milestone model + MilestoneStatus enum
- [x] MilestonePolicy (auth via project relationship)
- [x] GET /projects/{project}/milestones (filter: status)
- [x] POST /projects/{project}/milestones
- [x] PUT /milestones/{id}
- [x] PATCH /milestones/{id}/status (auto completed_at)
- [x] DELETE /milestones/{id}
- [x] FormRequest: StoreMilestoneRequest, UpdateMilestoneRequest, UpdateMilestoneStatusRequest
- [x] MilestoneResource (with tasks_count, tasks_done_count)

### 2.5 Weekly Planning Module
- [x] Create weekly_plans migration
- [x] WeeklyPlan model (unique: user_id + week_start)
- [x] WeeklyPlanPolicy
- [x] GET /weekly-plans (filter: week_start, defaults current week, auto tasks_completed)
- [x] POST /weekly-plans
- [x] PUT /weekly-plans/{id}
- [x] FormRequest: StoreWeeklyPlanRequest, UpdateWeeklyPlanRequest
- [x] WeeklyPlanResource

### 2.6 Project Notes Module
- [x] Create project_notes migration
- [x] ProjectNote model
- [x] ProjectNotePolicy
- [x] GET /projects/{project}/notes (paginated, sort)
- [x] POST /projects/{project}/notes
- [x] PUT /notes/{id}
- [x] DELETE /notes/{id}
- [x] FormRequest: StoreProjectNoteRequest, UpdateProjectNoteRequest
- [x] ProjectNoteResource

**Phase 2 Summary: 22 new routes (total 52), 7 migrations, 3 enums, 6 models, 6 controllers, 10 FormRequests, 5 Resources, 6 Services, 5 Policies**

---

## Phase 3 - Growth & Reflection -- COMPLETE

### 3.1 Skill Development Module
- [x] Create skill_categories migration
- [x] Create skills migration
- [x] Create learning_tasks migration
- [x] Create project_skill pivot migration
- [x] Models + relationships + enums (SkillLevel, LearningTaskStatus)
- [x] Skill Categories CRUD
- [x] Skills CRUD + link to projects (syncProjects)
- [x] Learning Tasks CRUD + status updates (auto completed_at)

### 3.2 Reflection Module
- [x] Create reflections migration
- [x] Reflection model + ReflectionType enum
- [x] GET /reflections (filter by type, paginated)
- [x] POST /reflections (weekly/monthly, unique per period)
- [x] PUT /reflections/{id}
- [x] DELETE /reflections/{id}

### 3.3 Frontend
- [x] Skill Categories (types, api, hooks)
- [x] Skills (types, api, hooks, SkillForm, SkillCard)
- [x] Learning Tasks (types, api, hooks, LearningTaskCard, LearningTaskForm)
- [x] Reflections (types, api, hooks, ReflectionForm, ReflectionCard)
- [x] SkillsPage + ReflectionsPage
- [x] Router + Sidebar updated

**Phase 3 Summary: 18 new routes (total 70), 5 migrations, 3 enums, 4 models, 4 controllers, 9 FormRequests, 4 Resources, 4 Services, 4 Policies**

---

## Phase 4 - Intelligence -- COMPLETE

### 4.1 Gemini AI Integration
- [x] Install laravel/ai SDK (requires PHP 8.3+)
- [x] 3 AI Agents: WeeklySummaryAgent, SuggestPrioritiesAgent, ReviewPromptAgent
- [x] AiService with context gathering + agent prompting
- [x] AiController (thin) with 3 FormRequests
- [x] POST /ai/weekly-summary
- [x] POST /ai/suggest-priorities
- [x] POST /ai/review-prompt
- [x] Rate limiting for AI endpoints (throttle:ai, 10/hour per user)

### 4.2 Enhanced Dashboard
- [x] GET /dashboard/overview (full aggregation with project health, skills, goals, notes)
- [x] Project health scoring logic (on_track / at_risk / blocked)

### 4.3 Git Integration
- [x] GitHubService (parse repo_url, call GitHub API, return simplified commits)
- [x] GitHubController with ProjectPolicy authorization
- [x] GET /projects/{project}/commits

### 4.4 Frontend
- [x] AI Assistant (types, api, hooks, AiPanel component)
- [x] AiPage
- [x] Router + Sidebar updated

**Phase 4 Summary: 5 new routes (total 75), 3 AI Agents, 2 new Services, 2 new Controllers, 3 FormRequests, 0 new models, 0 new migrations (SDK migration only)**

---

## Phase 5 - Boo Smart AI Assistant -- COMPLETE

### 5.1 Chat Agent
- [x] ChatAgent with RemembersConversations trait
- [x] POST /boo/chat (SSE streaming)
- [x] DELETE /boo/chat/{conversationId}
- [x] GET /boo/chat/history

### 5.2 Nudge System
- [x] NudgeService with 18 nudge types (9 original + 7 new + 2 AI)
- [x] NudgeAnalysisAgent for pattern_insight + priority_conflict
- [x] GET /boo/nudges
- [x] POST /boo/nudges/{type}/dismiss
- [x] nudge_dismissals table with expiry

### 5.3 Push Notifications
- [x] PushNotificationService with smart adaptive logic (max 4/day, 2h cooldown)
- [x] Web Push subscription management
- [x] Service Worker (sw.js) with notification click routing

### 5.4 Gamification
- [x] StreakService (current streak, longest streak, today progress)
- [x] Dashboard overview with streak data
- [x] StreakCard widget
- [x] Confetti effect (canvas-confetti, purple-themed)

### 5.5 Boo UI
- [x] FloatingBoo FAB with pulse animation
- [x] NudgeCard with priority border + action routing
- [x] ChatMessages with SSE streaming
- [x] BooAvatar SVG (6 expressions)
- [x] Toast auto-trigger on new high-priority nudges
- [x] Dark/Light theme (Neon Haunt / Ghostly Lavender)

**Phase 5 Summary: 5 new routes (total 80), 2 AI Agents, 2 new Services, 1 new Controller, 2 FormRequests, sw.js, FloatingBoo + NudgeCard + ChatMessages + StreakCard + ConfettiEffect**

---

## Phase 6 - Emotional Safety & Forgiveness

> Addresses: Burnout Prevention (Critical), Escalation Safety (Critical), Streak Forgiveness (Medium), Work-Life Balance (Medium)
> Brand ref: boo-brand.md sections X, XVI

### 6.1 Notification Settings Expansion

**Migration**: Add columns to `notification_settings`

| Column | Type | Default | Purpose |
|---|---|---|---|
| gentle_mode | boolean | false | Cap escalation at level 2, softer tone |
| quiet_hours_start | time | 22:00 | No push/toast before this time |
| quiet_hours_end | time | 08:00 | No push/toast after this time |
| weekend_mode | boolean | true | Reduce nudge intensity on Sat/Sun |

**Files to modify**:
- [ ] Migration: add 4 columns to notification_settings
- [ ] NotificationSetting model: update fillable, casts, defaults
- [ ] UpdateNotificationSettingRequest: add validation rules
- [ ] NotificationSettingResource: include new fields
- [ ] Frontend: Settings page — gentle mode toggle, quiet hours pickers, weekend mode toggle

### 6.2 NudgeService Safety Rules

**Quiet Hours**: Skip all push notifications and toasts outside user's active hours. Pull (FAB drawer) still works — user can always open manually.

**Weekend Mode**: On Saturday/Sunday only show:
- high-priority nudges (overdue_tasks, task_due_soon)
- positive nudges (daily_win, focus_streak)
- Skip: no_daily_focus, no_daily_activity, plan_tomorrow, wip_overload

**Gentle Mode**: When enabled:
- Cap escalation at level 2 (never guilt-trip or dramatic)
- Softer message variants for level 2
- No CAPS, no `*action text*`

**Files to modify**:
- [ ] NudgeService: add quiet hours check, weekend filter, gentle mode cap
- [ ] PushNotificationService: respect quiet hours before sending

### 6.3 Extended Absence & Welcome Back

**Detection**: If user has no task update AND no daily focus for 5+ consecutive days → classify as "extended absence".

**Behavior on return**:
- Reset ALL escalation levels to 1 (clear recent nudge_dismissals or ignore count)
- Show `welcome_back` nudge instead of guilt-based nudges
- Tone: encouraging, not guilt — "Boo vui quá bạn quay lại rồi~ Bắt đầu lại nhẹ nhàng nha!"
- First day back: only show 2-3 nudges max (no_daily_focus + welcome_back), don't overwhelm

**New nudge type**: `welcome_back`
- Priority: low (positive)
- Expression: happy
- Re-show: never (one-time per absence period)

**Files to modify**:
- [ ] NudgeService: add checkExtendedAbsence method, welcome_back nudge type + messages
- [ ] NudgeService: reset escalation logic when absence detected
- [ ] NudgeCard: add welcome_back action mapping
- [ ] sw.js: add welcome_back URL mapping

### 6.4 Burnout Detection

**New nudge type**: `overwork_warning`
- Trigger: User completes >8 tasks/day for 3+ consecutive days, OR task completions consistently after 23:00 for 3+ days
- Priority: medium
- Expression: sad (Boo worried, not happy about overwork)
- Message: "Boo thấy bạn làm nhiều quá tuần này... Nghỉ ngơi cũng là productivity đó~"

**Files to modify**:
- [ ] NudgeService: add checkOverwork method with baseline detection
- [ ] NudgeService: add overwork_warning to NUDGE_TYPES, MESSAGES
- [ ] NudgeCard + sw.js: add overwork_warning mapping

### 6.5 Streak Forgiveness

**Current problem**: Miss 1 focus task = streak broken = all-or-nothing.

**New rules**:
- **Partial credit**: Complete ≥2/3 focus tasks = streak continues (marked as "partial day", not "perfect day")
- **Rest day**: 1 rest day per week (no focus set) does NOT break streak. Tracked automatically — if user skips exactly 1 day in a 7-day window, streak holds.
- **Grace period**: If streak breaks, Boo gives encouraging tone: "Streak mới bắt đầu từ hôm nay~ Let's go!" — never guilt
- **Streak break notification**: expression = default (neutral), NOT sad

**Files to modify**:
- [ ] StreakService: update calculateCurrentStreak with partial credit + rest day logic
- [ ] StreakService: add isRestDay helper (check if only 1 gap in 7-day window)
- [ ] NudgeService: update focus_streak messages — no guilt on break
- [ ] StreakCard: show partial days differently (e.g. lighter color or dotted indicator)

### 6.6 Frontend — Settings Page

- [ ] Create SettingsPage with sections: Notifications, Boo Behavior
- [ ] Gentle mode toggle with explanation: "Boo sẽ nhẹ nhàng hơn, không guilt-trip"
- [ ] Quiet hours: start/end time pickers
- [ ] Weekend mode toggle with explanation
- [ ] Add /settings route + Sidebar link
- [ ] API hooks for notification settings CRUD

### Phase 6 Verification
1. Gentle mode ON → all nudges capped at level 2, no CAPS/action text
2. Outside quiet hours → no push notifications sent
3. Weekend + weekend_mode ON → only high-priority and positive nudges shown
4. 6 days no activity → return → welcome_back nudge, no guilt nudges, escalation reset
5. >8 tasks/day for 3 days → overwork_warning nudge appears
6. Complete 2/3 focus tasks → streak continues (partial day)
7. Skip 1 day in 7-day window → streak holds (rest day)
8. Streak breaks → encouraging message, not guilt

---

## Phase 7 - Meaning & Outcome

> Addresses: Output vs Outcome (High), Intrinsic Motivation (High), Planning Continuity (Medium), Reflection Feedback Loop (Medium)
> Brand ref: boo-brand.md sections IX, XI, XII

### 7.1 Task Expected Outcome

**Migration**: Add column to `tasks`

| Column | Type | Default | Purpose |
|---|---|---|---|
| expected_outcome | text | nullable | Definition of Done — what result this task should produce |

**Files to modify**:
- [ ] Migration: add expected_outcome to tasks
- [ ] Task model: add to fillable
- [ ] StoreTaskRequest / UpdateTaskRequest: add expected_outcome validation (nullable string, max 500)
- [ ] TaskResource: include expected_outcome
- [ ] Frontend TaskForm: add optional "Expected outcome" textarea
- [ ] Frontend TaskCard: show expected_outcome if present

### 7.2 Goal Connection Visibility

**Problem**: User does task daily but doesn't see HOW it connects to goals/life direction.

**Solution**: Enrich task display with upward chain: Task → Milestone → Project → Goal

**API change**: TaskResource includes chain when task has milestone:
- milestone.title, milestone.project.title
- If project has linked goals (via focus_areas or direct), include goal.title

**New nudge type**: `epic_meaning`
- Trigger: When user sets daily focus, if any focus task is linked to a milestone → nudge with connection
- Priority: low (positive)
- Message: "Task **{task}** là 1 bước trong Milestone **{milestone}** → Project **{project}**~ Bạn đang tiến bộ!"
- Expression: happy
- Frequency: Max 1/day, only when focus is set

**Files to modify**:
- [ ] TaskResource: include milestone chain (milestone.title, milestone.project.title)
- [ ] NudgeService: add checkEpicMeaning method
- [ ] NudgeService: add epic_meaning to NUDGE_TYPES, MESSAGES
- [ ] Frontend: TaskCard shows milestone/project breadcrumb if available
- [ ] Frontend: Daily Focus page shows goal connection for focused tasks
- [ ] NudgeCard + sw.js: add epic_meaning mapping

### 7.3 Milestone Progress Nudge

**New nudge type**: `milestone_progress`
- Trigger: When a task belonging to a milestone is marked done → show milestone progress update
- Priority: low (positive)
- Message: "Task xong! Milestone **{milestone}** giờ {done}/{total} ({percent}%)~"
- Expression: happy
- Not dismissable — ephemeral toast only, doesn't appear in nudge drawer

**Files to modify**:
- [ ] NudgeService: add milestone_progress type (toast-only, not persisted in nudge list)
- [ ] Frontend: trigger toast via task completion mutation's onSuccess callback
- [ ] DashboardService: milestone progress already available via project_health

### 7.4 Outcome Review (Lightweight)

**When task with expected_outcome is marked done**, Boo can prompt: "Task xong~ Kết quả **'{expected_outcome}'** đạt chưa bạn?"

**Implementation**: Not a mandatory flow. Boo asks via nudge/toast, user can dismiss. If user engages in chat, Boo references the outcome.

**New nudge type**: `outcome_check`
- Trigger: Task with expected_outcome marked done
- Priority: low
- Message: "Task **{title}** xong rồi~ Kết quả '{outcome}' có đạt không bạn?"
- Action: Opens chat with pre-filled context
- Re-show: never (one-time per task)

**Files to modify**:
- [ ] NudgeService: add outcome_check check (query recently completed tasks with expected_outcome)
- [ ] NudgeService: add outcome_check to NUDGE_TYPES, MESSAGES
- [ ] NudgeCard + sw.js: add outcome_check mapping (action → open chat)

### 7.5 Reflection Feedback Loop

**Problem**: Reflections are written and forgotten. Boo doesn't reference them.

**Solution 1 — AI-powered** (preferred, leverages existing ChatAgent):
- When generating weekly nudges (pattern_insight on Monday), AI agent also reads last reflection's `to_improve` field
- AI generates nudge that references past commitment: "Tuần trước bạn viết sẽ **{to_improve}**. Tuần này thế nào rồi?"

**Solution 2 — Rule-based** (simpler fallback):
- New nudge type: `reflection_followup`
- Trigger: Monday, if last weekly reflection has `to_improve` content
- Message: "Tuần trước bạn viết sẽ cải thiện: **{to_improve}**. Boo tò mò tuần này thế nào~"

**Files to modify**:
- [ ] NudgeService: add checkReflectionFollowup method (reads last reflection's to_improve)
- [ ] NudgeService: add reflection_followup to NUDGE_TYPES, MESSAGES
- [ ] NudgeCard + sw.js: add reflection_followup mapping (action → /reflections)

### 7.6 Goal Progress Field

**Migration**: Add column to `goals`

| Column | Type | Default | Purpose |
|---|---|---|---|
| progress | integer | 0 | 0-100, manual or auto-calculated progress percentage |

**Auto-calculation option**: If goal has linked projects (via focus_areas), progress = avg of project progress.

**Files to modify**:
- [ ] Migration: add progress to goals
- [ ] Goal model: add to fillable, cast as integer
- [ ] GoalResource: include progress
- [ ] Frontend: GoalCard shows progress bar
- [ ] DashboardView: weekly_goals section shows progress, not just count

### Phase 7 Verification
1. Create task with expected_outcome → shows in task detail
2. Task with milestone marked done → toast: "Milestone X giờ 60%~"
3. Set daily focus with milestone-linked task → epic_meaning nudge appears
4. Task with expected_outcome done → outcome_check nudge asks if result achieved
5. Write reflection with to_improve → next Monday → reflection_followup nudge references it
6. Goal progress bar reflects linked project progress

---

## Phase 8 - Intelligence & Delight

> Addresses: Decision Support (High), Celebration Habituation (Low), Onboarding (Low), Ghost Metaphor Depth (Low)
> Brand ref: boo-brand.md sections XII, XIII, XIV, XV

### 8.1 Smart Focus Suggestion

**Problem**: User opens Daily Focus but doesn't know which 3 tasks to pick.

**Solution**: `GET /api/v1/daily-focus/suggestions` — returns top 5 recommended tasks with reasoning.

**Scoring algorithm** (simple, rule-based):
- Due date proximity: due tomorrow = +10, due in 3 days = +5
- Priority weight: high = +8, medium = +4, low = +1
- Stuck penalty: in_progress >3 days = +3 (should finish)
- Goal connection: has milestone = +2
- Previously focused but not done: +3

**Files to modify**:
- [ ] DailyFocusService: add suggestFocusTasks method
- [ ] DailyFocusController: add suggestions endpoint
- [ ] Frontend: Daily Focus page shows "Boo gợi ý~" section with suggested tasks + quick-add buttons

### 8.2 Overcommitment Detection

**New nudge type**: `overcommitment`
- Trigger: >5 tasks due same day, all status != done
- Priority: high
- Message: "Bạn có {count} task due hôm nay mà chưa xong... Boo nghĩ nên chọn {suggest} task quan trọng nhất thôi~"
- Expression: sad

**Files to modify**:
- [ ] NudgeService: add checkOvercommitment method
- [ ] NudgeService: add overcommitment to NUDGE_TYPES, MESSAGES
- [ ] NudgeCard + sw.js: add mapping

### 8.3 Celebration Tiers

**Replace single confetti with tiered system**:

| Tier | Trigger | Effect |
|---|---|---|
| **Micro** | Any task done | Boo expression → happy (no animation) |
| **Standard** | Daily win, streak 3-7 | Toast + standard confetti |
| **Major** | Streak 14-30, milestone completed | Toast + extended confetti + unique Boo message |
| **Epic** | Streak 60+, goal completed, project completed | Full-screen confetti burst + celebration modal + relationship milestone |

**Files to modify**:
- [ ] ConfettiEffect: add tiers (standard, major, epic) with different particle counts/duration
- [ ] FloatingBoo: determine tier based on nudge type + data (streak count, milestone vs goal)
- [ ] Create CelebrationModal component for Epic tier
- [ ] NudgeService: include streak count in focus_streak data for tier determination

### 8.4 Surprise Achievements

**New nudge type**: `achievement`
- One-time achievements triggered by specific milestones user doesn't know about
- Priority: low (positive), expression: happy
- Never repeats (tracked by achievement key in nudge_dismissals)

**Achievement list**:

| Key | Trigger | Boo message |
|---|---|---|
| first_task | First task completed ever | "Task đầu tiên xong! Hành trình bắt đầu từ đây~" |
| early_bird | Task completed before 8am | "Bạn dậy sớm làm task! Boo impressed~" |
| night_owl | Task completed after midnight | "Task lúc nửa đêm... Boo cũng thức cùng bạn~" |
| streak_record | Surpass personal longest streak | "KỶ LỤC MỚI! {days} ngày streak — vượt record cũ rồi!" |
| project_closer | First project marked completed | "Project đầu tiên hoàn thành! Boo được giải thoát 1 phần~" |
| idea_machine | 10th idea converted to task/project | "10 ideas đã thành hiện thực! Boo thấy bạn là người hành động~" |
| reflection_master | 4 consecutive weekly reflections | "4 tuần reflect liên tiếp! Self-awareness level up~" |

**Files to modify**:
- [ ] NudgeService: add checkAchievements method (query milestones, track via dismissed keys)
- [ ] NudgeService: add achievement to NUDGE_TYPES, MESSAGES (dynamic by achievement key)
- [ ] ConfettiEffect: achievements trigger Major tier celebration

### 8.5 Onboarding Flow

**Tracking**: Add `onboarding_step` column to users (integer, nullable, null = completed)

**Steps** (progressive, Boo guides user through first setup):
1. **Welcome** — Show welcome modal with Boo introduction after first login
2. **First Project** — Nudge to create first project if none exists
3. **First Tasks** — Nudge to create tasks in the project
4. **First Focus** — Nudge to set daily focus
5. **Complete** — Mark onboarding done, transition to normal nudge flow

**Progressive Disclosure**: Track user's `created_at` to determine which nudge types to show:
- Week 1: no_daily_focus, overdue_tasks, daily_win, focus_streak
- Week 2: + no_weekly_plan, plan_tomorrow, task_due_soon
- Week 3: + task_stuck, wip_overload, pattern_insight
- Week 4+: All nudge types enabled

**Files to modify**:
- [ ] Migration: add onboarding_step to users (integer, nullable)
- [ ] User model: add to fillable
- [ ] NudgeService: filter nudge types based on user age (created_at weeks)
- [ ] Create OnboardingModal frontend component (step-by-step Boo introduction)
- [ ] AppShell: show OnboardingModal when user.onboarding_step is not null

### 8.6 Ghost Metaphor — Rest in Peace

**When milestone or project is completed**, show special celebration:
- Boo: "Milestone **{name}** hoàn thành! Phần này được giải thoát rồi~ Boo nhẹ nhõm!"
- For project completion: "Project **{name}** xong! Ghost này đã được siêu thoát~"
- Expression: happy with special "peaceful" variant (eyes closed, serene)
- Trigger: Epic tier celebration

**Files to modify**:
- [ ] NudgeService: detect milestone/project completion → rest_in_peace nudge
- [ ] Add `rest_in_peace` to NUDGE_TYPES with special messages
- [ ] BooAvatar: consider adding 7th expression "peaceful" (optional)
- [ ] CelebrationModal: special "rest in peace" variant for project completion

### Phase 8 Verification
1. Open Daily Focus → "Boo gợi ý" shows top 5 tasks with scores
2. >5 tasks due today → overcommitment nudge appears
3. Streak 7 → standard confetti; streak 30 → major confetti; streak 60 → epic modal
4. First task ever completed → "first_task" achievement toast
5. Task completed before 8am → "early_bird" achievement (one-time)
6. New user Day 1 → OnboardingModal, limited nudge types
7. New user Week 3 → full nudge types unlocked
8. Complete milestone → "Rest in Peace" celebration with special message

---

## Phase Summary

| Phase | Focus | New Routes | New Nudge Types | Migrations |
|---|---|---|---|---|
| 6 | Safety & Forgiveness | 0 | 2 (welcome_back, overwork_warning) | 1 (notification_settings) |
| 7 | Meaning & Outcome | 0 | 4 (epic_meaning, milestone_progress, outcome_check, reflection_followup) | 2 (tasks, goals) |
| 8 | Intelligence & Delight | 1 (focus suggestions) | 3 (overcommitment, achievement, rest_in_peace) | 1 (users) |
| **Total** | | **1** | **9** | **4** |

### Implementation Order
Phase 6 → 7 → 8 (sequential, each builds on previous)

### Dependency Notes
- Phase 6 has no external dependencies, purely behavioral changes
- Phase 7.2 (goal connection) depends on existing milestone→project→goal chain
- Phase 8.1 (smart suggestions) is independent, can be built in parallel with 8.3-8.6
- Phase 8.5 (onboarding) should be built last as it depends on knowing which nudge types exist
