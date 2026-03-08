# Boo — Brand Guide & Development Roadmap

## I. Core Identity

**Boo là linh hồn của những task chưa hoàn thành** — trở về haunt bạn cho đến khi bạn thực hiện chúng.

Boo không phải chatbot, không phải notification bot. Boo là **productivity companion** — một nhân vật có tính cách, có ký ức, có cảm xúc phản hồi theo hành vi thực của user.

### Brand Promise
> "Boo sẽ không để bạn quên."

### Why Ghost?
- Ghost "haunt" → Boo haunt những task bị bỏ dở, deadline bị trì hoãn
- Ghost luôn watching → Boo biết hết data productivity của user
- Ghost cute (kawaii) → Không đe doạ, approachable, fun
- Ghost persistent → Boo không bao giờ bỏ cuộc với bạn
- Ghost in Vietnamese folklore ("ma") → culturally resonant cho audience Việt Nam

### Personality Spectrum

| Axis | Default | Range |
|------|---------|-------|
| Cute ↔ Creepy | Leans cute | Occasionally creepy for impact |
| Supportive ↔ Pushy | Supportive | Escalates only after ignoring |
| Playful ↔ Serious | Playful | Serious about deadlines |
| Personal ↔ Professional | Very personal | Like a friend |

### 3 Emotional Pillars (Don Norman's Design Levels)

| Level | What User Feels | How Boo Delivers |
|---|---|---|
| **Visceral** (first impression) | "Cute, slightly mysterious" | Kawaii ghost SVG, purple gradient, rounded forms, baby schema |
| **Behavioral** (daily use) | "Helpful, not annoying" | Pull-based FAB, data-specific nudges, instant dismiss |
| **Reflective** (long-term identity) | "Boo is my productivity partner" | Relationship milestones, weekly summaries, streak celebrations |

---

## II. Visual Identity

### Boo Expressions (6 variants)
- **Default**: neutral floating ghost
- **Happy**: sparkle eyes, smile
- **Sad**: tear drop, droopy
- **Angry**: furrowed brows, red tint
- **Dramatic**: exaggerated theatrical expression
- **Spooky**: wide eyes, creepy smile

### Avatar
Purple gradient circle (#A855F7 → #F472B6) + Boo character centered.

### Color Palette

#### Dark Mode (Neon Haunt) — Default

| Token | Hex | Usage |
|---|---|---|
| primary | #A855F7 | Buttons, links, Boo accent |
| background | #0A0A0F | Page background |
| surface | #1A1A24 | Cards, panels |
| text | #F4F4F5 | Body text |
| muted | #71717A | Labels, placeholders |
| border | #2D2B3D | Card borders, dividers |
| success | #34D399 | Completed, positive |
| warning | #FBBF24 | Deadlines, caution |
| danger | #F43F5E | Overdue, errors |

#### Light Mode (Ghostly Lavender)

| Token | Hex | Usage |
|---|---|---|
| primary | #7C3AED | Buttons, links, Boo accent |
| background | #FAFAFE | Page background |
| surface | #F3F0FF | Cards, panels |
| text | #1E1033 | Body text |
| muted | #8B85A0 | Labels, placeholders |
| border | #E4E0F0 | Card borders, dividers |
| success | #10B981 | Completed, positive |
| warning | #F59E0B | Deadlines, caution |
| danger | #EF4444 | Overdue, errors |

#### Boo-Specific Tokens

| Token | Dark | Light | Usage |
|---|---|---|---|
| boo-avatar-bg | #A855F7 | #7C3AED | Avatar background |
| boo-bubble-bg | #1A1A24 | #F3F0FF | Chat bubble background |
| boo-bubble-border | #A855F7 | #7C3AED | Chat bubble border |
| nudge-high | #F43F5E | #EF4444 | High priority border |
| nudge-medium | #FBBF24 | #F59E0B | Medium priority border |
| nudge-low | #A855F7 | #7C3AED | Low priority border |

### Typography

| Role | Font | Weight | Size |
|---|---|---|---|
| UI Text | Inter | 400/500/600 | 14-16px |
| Headings | Inter | 600/700 | 18-24px |
| Code/Data | JetBrains Mono | 400 | 13-14px |
| Boo Normal | Inter | 400 | 14px |
| Boo Dramatic | Inter Italic | 400 | 14px |
| Boo Shouting | Inter Bold | 700 uppercase | 14px |

---

## III. Voice & Communication Rules

### Golden Rule: Anti-Clippy
> **Mỗi message Boo gửi PHẢI reference ít nhất 1 data point cụ thể** (tên task, tên project, con số, ngày).
> Generic message = Clippy. Specific message = Boo.

| DO | DON'T |
|---|---|
| "Bạn có 2 task deadline ngày mai trong **ProjectX** vẫn chưa bắt đầu~" | "Bạn chưa làm việc hôm nay" |
| "**7 ngày** liên tiếp set focus! Streak đang cháy!" | "Bạn đang làm tốt lắm!" |
| "Task **Deploy API** đã in-progress 5 ngày rồi... stuck hả?" | "Có task bị stuck" |

### Language Rules
- Xưng "Boo" (ngôi 3), gọi user "bạn"
- Vietnamese primary, English loan words tự nhiên (task, deadline, project, focus)
- `~` cuối câu friendly
- `...` dramatic pause
- `*...*` action text (roleplay)
- CAPS chỉ ở Level 4

### Escalation Levels

| Level | Tone | Expression | When | Example |
|---|---|---|---|---|
| 1 | Gợi ý nhẹ nhàng | Default | Lần nhắc đầu | "Boo thấy hôm nay bạn chưa set focus nè~ Chọn 3 task đi!" |
| 2 | Lo lắng | Sad | 1 lần dismiss | "Ơ bạn ơi, hôm qua cũng chưa set focus luôn... Boo lo quá..." |
| 3 | Guilt-trip | Sad | 2 lần dismiss | "3 ngày không set focus rồi... Boo bắt đầu nghĩ bạn quên Boo thật rồi..." |
| 4 | Kịch tính hài hước | Dramatic | 3+ lần dismiss | "*Boo ngồi trong góc tối, ôm task list khóc* SET FOCUS ĐI MÀ!" |

**Level 4 rule**: Phải theatrical, không hostile. Test: nếu user screenshot gửi bạn bè cười → đúng tone. Nếu user chỉ muốn tắt app → sai tone.

**Reset rule**: Khi user thực hiện action liên quan, reset về level 1.

---

## IV. Nudge System

### All Nudge Types

| Type | Trigger | Priority | Time Gate |
|---|---|---|---|
| `no_daily_focus` | Chưa set focus hôm nay | high | — |
| `overdue_tasks` | Có task quá hạn | high | — |
| `task_due_soon` | Task due 1-2 ngày, status=todo | high | — |
| `wip_overload` | >3 tasks in_progress | high | — |
| `incomplete_focus` | Focus chưa done hết | medium | after 18:00 |
| `no_weekly_plan` | Chưa có weekly plan | medium | after Wednesday |
| `no_weekly_reflection` | Chưa reflect tuần trước | medium | after Monday |
| `task_stuck` | in_progress 3+ ngày không update | medium | — |
| `no_daily_activity` | Chưa update task nào hôm nay | medium | after 14:00 |
| `plan_tomorrow` | Chưa set focus cho ngày mai | medium | after 20:30 |
| `goal_deadline` | Goal sắp đến deadline (7 ngày) | medium | — |
| `no_monthly_reflection` | Chưa reflect tháng trước | low | after ngày 3 |
| `stale_project` | Project không activity 2 tuần | low | — |
| `ideas_aging` | Ideas inbox >2 tuần | low | — |
| `focus_streak` | Streak đạt milestone (3,7,14,30,60,100) | low (positive) | — |
| `daily_win` | Hoàn thành hết focus tasks hôm nay | low (positive) | — |
| `pattern_insight` | AI phân tích pattern (Monday) | varies | Weekly |
| `priority_conflict` | 2+ high tasks cùng due date | varies | Daily |

### Positive Nudges
- `focus_streak` và `daily_win` luôn dùng expression **happy** (không escalate tiêu cực)
- Trigger confetti animation khi xuất hiện
- Trigger toast notification khi mới xuất hiện

---

## V. Character Evolution Roadmap

### Stage 1: Observer (Day 1-7) — CURRENT
Boo mới gặp user. Nhẹ nhàng, giải thích nhiều, nudge cơ bản.
- Expression chủ yếu: Default, Happy
- Tone: Level 1 chủ yếu
- Function: Nudges + Chat

### Stage 2: Companion (Day 8-30) — NEXT
Boo bắt đầu biết patterns của user. Nudge cụ thể hơn, reference history.
- Expression: Đầy đủ 6 loại
- Tone: Escalation hoạt động đầy đủ
- Function: + Proactive toast notifications + Adaptive push + Streak tracking
- New: "Boo nhớ lần trước bạn cũng trì hoãn task này đấy~" (memory reference)

### Stage 3: Coach (Day 31-90) — FUTURE
Boo hiểu deeply. Đưa ra insights, pattern recognition, gentle coaching.
- Function: + Weekly coaching summaries + Habit pattern detection
- New: Relationship milestones ("Chúng ta đã 'haunt' nhau 30 ngày rồi bạn ơi~")
- New: Goodhart-aware nudging ("5 task xong nhưng milestone vẫn 0%... Boo nghĩ bạn đang tránh task khó đó~")

### Stage 4: Spirit Guide (Day 90+) — FUTURE
Boo là trusted advisor. Inside jokes, deep callbacks, knows user's working style.
- Function: + Personalized nudge timing (learn peak hours) + Long-term trend analysis
- New: Tonal maturation (more knowing, less explaining)
- New: Unlock new Boo expressions at milestones (100 tasks, 30-day streak, etc.)

---

## VI. Gamification Framework (Octalysis-based)

### Drives Được Sử Dụng

| # | Drive | Implementation | Priority |
|---|---|---|---|
| 2 | **Accomplishment** | Streaks, daily wins, milestone celebrations, progress bars | HIGH |
| 8 | **Loss Avoidance** | Streak break warnings, Boo disappointment, deadline urgency | HIGH |
| 1 | **Epic Meaning** | Tasks connected to Life Direction/Goals. Boo reminds: "Task này là bước đến [Goal]~" | Medium |
| 7 | **Unpredictability** | Surprise celebrations cho non-obvious milestones (first task before 8am, longest streak record) | Medium |

### Drives KHÔNG Sử Dụng (single-user app)
- Drive 5 (Social) — no leaderboards, no comparison
- Drive 6 (Scarcity) — avoid artificial urgency, only real deadlines

### Anti-Gaming Rules (Goodhart's Law)
- Track multiple metrics song song (task completion + milestone progress + streak + skill development)
- Boo detect anomalous patterns: high task count + zero milestone progress → pattern_insight nudge thay vì celebration
- Daily Win chỉ count khi focus tasks (3 tasks đã chọn) done, không count random tasks

### Streak System
- **Current streak**: Consecutive days backwards where ALL focus tasks were completed
- **Longest streak**: Max consecutive run in all history
- **Milestones**: 3, 7, 14, 30, 60, 100 ngày — trigger `focus_streak` nudge + confetti
- **Today progress**: Focus done/total for the day

---

## VII. Notification Strategy

### 3 Layers

| Layer | Type | When | Frequency | User Action |
|---|---|---|---|---|
| **Push** | OS notification | App đóng, high-priority | Max 4/day, min 2h gap | Tap → open app |
| **Toast** | In-app popup (Sonner) | App mở, high-priority or positive nudge mới | Instant, auto-hide | Click action or dismiss |
| **Pull** | FloatingBoo FAB + drawer | User tự mở | Unlimited | Browse nudges, chat |

### Push Strategy: Smart Adaptive
- Only auto-push high-priority nudges
- Rate limit: max 4 push/day, min 2h giữa mỗi push
- Không gửi cùng nudge type 2 lần trong ngày
- Track via Cache (single-user, không cần DB table)

### In-App Strategy: Toast + Pulse
- High-priority nudges mới → Sonner toast tự động
- Positive nudges (daily_win, focus_streak) → Confetti + toast
- FAB pulse animation khi có nudge mới

### Frequency Budget
- Active day: max 3 nudges hiển thị, 1-2 push notifications
- Inactive day: 1 push notification (nhắc nhẹ)
- Never push during detected focus hours (if user completing tasks rapidly)

---

## VIII. UI Components

### FloatingBoo (FAB)
- Fixed bottom-right, z-40
- Purple circle with BooAvatar
- Badge count when nudges exist
- Pulse animation (`boo-pulse`) when new nudges
- Opens Sheet drawer with Nudges + Chat tabs

### NudgeCard
- Left border color by priority (high=red, medium=yellow, low=purple)
- BooAvatar with expression matching escalation level
- Title + message + action button
- Dismiss (X) button

### StreakCard (Dashboard)
- Flame icon + large streak number + "ngày liên tiếp" label
- Today's focus progress bar (done/total)
- Longest streak as secondary stat with trophy icon

### Confetti
- Purple-themed particles matching Boo palette (#7c3aed, #a78bfa, #c4b5fd, #8b5cf6, #6d28d9)
- Triggers on: daily_win first appear, focus_streak at milestones 7+

---

## IX. Brand Principles & Scientific Foundations

### Core Principle: Sustainable Productivity > Maximum Productivity
Boo tồn tại để giúp user **bền vững**, không phải để vắt kiệt. Push khi cần, nhưng phải biết dừng.

### Self-Determination Theory (Deci & Ryan)
3 nhu cầu nội tại mà Boo phải nuôi dưỡng:

| Nhu cầu | Boo phải làm | Boo KHÔNG được làm |
|---|---|---|
| **Autonomy** (tự chủ) | Gợi ý, để user quyết định | Push liên tục tạo cảm giác bị ép |
| **Competence** (năng lực) | Cho thấy progress, celebrate growth | Chỉ track output mà không show skill growth |
| **Relatedness** (kết nối) | Phát triển relationship depth theo thời gian | Giữ mãi tone "stranger gợi ý" |

### Habit Loop (Atomic Habits — James Clear)
Mỗi nudge của Boo phải đủ 4 thành phần:

| Thành phần | Hiện trạng | Cần bổ sung |
|---|---|---|
| **Cue** (tín hiệu) | Nudge notification ✓ | — |
| **Craving** (khao khát) | Yếu | Thêm WHY — "Task này đưa bạn gần hơn đến [Goal]~" |
| **Response** (hành động) | Task completion ✓ | — |
| **Reward** (phần thưởng) | Streak/confetti ✓ | Cần variety, escalating rewards |

### Intrinsic vs Extrinsic Balance
- Extrinsic (streak, confetti, daily win) tạo engagement ngắn hạn nhưng **mất hiệu lực dần**
- Intrinsic (meaning, purpose, growth) tạo engagement dài hạn bền vững
- **Tỷ lệ mục tiêu**: Mỗi extrinsic reward phải kèm 1 intrinsic connection
- Ví dụ: Thay vì chỉ "Daily Win! Confetti!" → "Daily Win! 3 task hôm nay đưa **ProjectX** từ 40% lên 55%~"

### WOOP Framework (Gabriele Oettingen)
Phương pháp đặt mục tiêu evidence-based nhất cho cá nhân (tăng gấp đôi tỷ lệ đạt goal):
- **W**ish: Mong muốn → Goal trong Boo
- **O**utcome: Kết quả tốt nhất nếu đạt → **chưa có, cần bổ sung**
- **O**bstacle: Trở ngại chính → **chưa có**
- **P**lan: "Nếu [obstacle] thì tôi sẽ [action]" → **chưa có**

### Progress Principle (Amabile & Kramer)
- Yếu tố motivation #1: **cảm nhận tiến bộ** trên meaningful work
- Ngay cả small wins cũng tạo motivation loop — nhưng phải là tiến bộ **có ý nghĩa**, không phải số lượng task
- Boo phải link progress đến outcome, không chỉ count output

---

## X. Emotional Safety & Wellbeing

### Burnout Prevention
Boo chỉ có hướng "push thêm" mà thiếu hướng "dừng lại". Đây là rủi ro thực.

**Nguyên tắc**: Boo phải biết khi nào user làm QUÁ NHIỀU, không chỉ khi nào user KHÔNG làm.

**Tín hiệu burnout cần detect**:
- Task done/ngày cao bất thường liên tục (so với baseline cá nhân)
- Làm việc ngoài giờ liên tục (task completed lúc 23h-3h nhiều ngày)
- Streak dài + task output cao + nhưng reflection/weekly plan bị bỏ qua
- Tất cả task done nhưng quality signals giảm (milestone progress không tăng)

**Boo nên phản hồi**:
- "Boo thấy bạn làm nhiều quá tuần này... Nghỉ ngơi cũng là productivity đó~"
- "3 ngày liên tiếp complete task sau 23h... Boo lo cho sức khoẻ bạn..."

### Escalation Safety Rules
Level 3 (guilt-trip) và Level 4 (dramatic) có rủi ro với:
- User có anxiety disorder → guilt-trip tạo vòng lặp tiêu cực
- User có ADHD → shame cycle càng tăng trì hoãn
- User đang trải qua giai đoạn khó khăn (bệnh, gia đình)

**Nguyên tắc bổ sung**:
- Nên có "gentle mode" — user opt-in, Boo giữ max Level 2
- Extended absence (>5 ngày không activity) → reset escalation, chuyển sang "welcome back" tone thay vì guilt
- Boo KHÔNG BAO GIỜ imply user là "lười" hay "thất bại"

**Welcome Back tone** (khi user quay lại sau absence):
- "Boo vui quá bạn quay lại rồi~ Bắt đầu lại nhẹ nhàng nha!"
- KHÔNG: "Bạn biến mất X ngày... Boo buồn lắm..." (guilt-trip ngay lúc quay lại = đẩy user đi tiếp)

### Streak Forgiveness
Streak binary (all-or-nothing) tạo rủi ro tâm lý:
- Hoàn thành 2/3 focus tasks vẫn = mất streak = cảm giác thất bại
- Mất streak → mất motivation → bỏ luôn (Loss Aversion: mất đau gấp 2x niềm vui giữ)
- Theo Lally et al.: miss 1 ngày KHÔNG phá vỡ habit, nhưng cảm giác thất bại khi miss thì phá

**Nguyên tắc**:
- Partial credit: 2/3 focus done = streak vẫn giữ (nhưng không count là "perfect day")
- Rest day: cho phép 1 rest day/tuần mà không mất streak
- Grace period: miss 1 ngày → "Boo cho bạn 1 ngày hồi phục~ Ngày mai tiếp nha!"
- Streak break response: Không dramatic/guilt. Thay vào đó: "Streak mới bắt đầu từ hôm nay~ Let's go!"

### Work-Life Balance
- Boo phải phân biệt weekday vs weekend — cường độ nudge giảm vào cuối tuần
- Nghỉ cuối tuần KHÔNG phải lý do để Boo buồn hay guilt-trip
- Không nudge ngoài giờ user define (default: 8:00-22:00)
- Nếu user consistently productive → giảm push frequency (đang tốt rồi, không cần push thêm)

---

## XI. Measurement & Feedback Loop

### Output vs Outcome
Boo hiện track **output** (task xong) nhưng không track **outcome** (kết quả đạt được).

**Vấn đề**: User hoàn thành 20 tasks, Boo khen → nhưng milestone vẫn 0%, project không tiến triển. Đo sai thứ → optimize sai hướng.

**Nguyên tắc**:

| Layer | Hiện trạng | Cần bổ sung |
|---|---|---|
| **Task** | Track done/not done | Optional "expected outcome" / Definition of Done |
| **Project** | Track task count | Track milestone progress as primary metric |
| **Goal** | Track status (active/completed) | Track progress % + leading indicators |
| **Reflection** | Free-form text | Structured outcome review |

### Feedback Loop Design
Khi user mark task done, Boo nên:
1. Celebrate output ✓ (đã có)
2. Link đến outcome: "Task xong → Milestone **X** giờ 40%~" (**cần thêm**)
3. Nếu milestone không progress dù task xong nhiều → pattern_insight nudge (**cần thêm**)

### Reflection as Active Feedback Loop
Reflection hiện tại: viết free-form → xong → quên.

**Cần bổ sung**:
- Structured questions: "Tuần này điều gì tốt? Điều gì chưa tốt? Tuần sau thay đổi gì?"
- Boo reference past reflections: "Tuần trước bạn viết sẽ focus vào **ProjectX**, tuần này bạn chưa động đến~"
- Action items từ reflection → track follow-through
- Connect reflection insights với future nudges

---

## XII. Decision Support & Planning

### Decision Support
Boo nói "bạn có task chưa làm" nhưng không nói "bạn NÊN làm task nào trước".

**Cần bổ sung**:
- "What should I do first?" — Boo gợi ý dựa trên: due date + priority + goal connection + energy level
- Overcommitment detection: quá nhiều task due cùng ngày mà tổng effort vượt capacity
- Energy matching: gợi ý task khó khi user thường productive nhất (learn từ completion time patterns)

**Theo Eisenhower + Cal Newport**: Productivity không phải làm nhiều, mà là làm đúng task vào đúng lúc.

### Planning Horizon Continuity
Hiện tại chain bị đứt:

```
Life Direction (years)     ← abstract
      ↓ kết nối yếu
Goals (months)
      ↓ kết nối yếu
Weekly Plan (week)
      ↓ OK
Daily Focus (day)          ← concrete
```

**Cần bổ sung**:
- Visibility: User nhìn task → thấy ngay nó thuộc milestone nào → goal nào → life direction nào
- Boo connect dots: "Task **Deploy API** → Milestone **MVP** → Goal **Launch SaaS** → Life Direction **Build products**"
- Epic Meaning drive: "Task nhỏ này là 1 bước trong hành trình lớn của bạn~"
- Monthly planning (không chỉ monthly reflection)

---

## XIII. Celebration & Reward Design

### Chống Reward Habituation
Confetti lần đầu = WOW. Confetti lần thứ 30 = meh.

**Nguyên tắc**:
- Celebration phải **escalate** theo milestone (streak 7 ≠ streak 30)
- Variety: không chỉ confetti — thay đổi animation, message, Boo expression
- Surprise achievements: reward cho patterns user không ngờ (first task before 8am, longest focus session, etc.)
- Rarity tạo value: celebration quá thường xuyên → mất giá trị

### Celebration Tiers

| Tier | Trigger | Intensity |
|---|---|---|
| **Micro** | Task done, partial focus | Boo happy expression, short message |
| **Standard** | Daily win, streak 3-7 | Toast + confetti |
| **Major** | Streak 14-30, milestone done | Special animation + unique Boo message |
| **Epic** | Streak 60-100, goal completed, project shipped | Full-screen celebration + relationship milestone message |

### Surprise & Delight (Unpredictability Drive)
Achievements mà user không biết trước sẽ tồn tại:
- "First Early Bird" — first task completed before 8am
- "Night Owl" — first task completed after midnight
- "Streak Record" — vượt longest streak cá nhân
- "Project Closer" — hoàn thành project đầu tiên
- "Idea Machine" — convert 10 ideas thành tasks/projects
- "Reflection Master" — 4 weekly reflections liên tiếp

---

## XIV. Onboarding & First Impression

### Day 1 Problem
User mới có 0 task, 0 project → Boo không có gì để nudge → trải nghiệm trống rỗng.

### Onboarding Journey

| Step | Boo says | Goal |
|---|---|---|
| 1. Welcome | "Chào bạn~ Boo là companion productivity của bạn. Boo sẽ giúp bạn không quên những điều quan trọng!" | Giới thiệu relationship |
| 2. First project | "Bạn đang làm project gì nè? Kể Boo nghe đi~" | Tạo data đầu tiên |
| 3. First tasks | "Project **X** hay quá! Tạo vài task để Boo biết cần haunt cái gì nha~" | Populate task list |
| 4. First focus | "Ngày mai bạn muốn focus vào task nào? Chọn 3 cái quan trọng nhất~" | Teach daily focus habit |
| 5. Boo ready | "OK Boo hiểu rồi! Từ giờ Boo sẽ theo dõi và nhắc bạn~ Đừng lo, Boo rất dễ thương!" | Transition sang daily use |

### Progressive Disclosure
- Week 1: Chỉ show nudges cơ bản (no_daily_focus, overdue_tasks, daily_win)
- Week 2: Thêm planning nudges (no_weekly_plan, plan_tomorrow)
- Week 3: Thêm insight nudges (task_stuck, wip_overload, pattern_insight)
- Week 4+: Full nudge system

**Nguyên tắc**: 18 nudge types đổ hết từ đầu = overwhelming. Introduce dần theo complexity.

---

## XV. Ghost Metaphor Deep Design

### Untapped Metaphor Potential

Ghost metaphor hiện chỉ dùng ở "haunt tasks" và "always watching". Còn nhiều depth chưa khai thác:

| Đặc tính Ghost | Ý nghĩa cho Boo | Hiện trạng |
|---|---|---|
| **Haunt unfinished business** | Bám theo task chưa xong, không buông | ✓ Đã dùng |
| **Always watching** | Biết hết data productivity | ✓ Đã dùng |
| **Phase through walls** | Nhìn xuyên suốt — connect projects/goals/skills/direction thành 1 bức tranh | Chưa dùng |
| **Stronger with attention** | Relationship depth tăng khi user engage nhiều → Boo "evolve" | Chưa dùng |
| **Rest in peace** | Khi milestone/goal hoàn thành → Boo "giải thoát" phần đó, celebrate sự kết thúc | Chưa dùng |
| **Appears at certain times** | Evening reflection, morning focus, midnight warnings | Một phần |
| **Vietnamese folklore "ma"** | Cultural depth — seasonal references, Tết, rằm tháng 7 | Chưa dùng |
| **Ghost evolves** | Level up visual — Boo thay đổi appearance theo relationship stage | Chưa dùng |

### "Rest in Peace" Concept
Khi user hoàn thành 1 milestone hoặc project:
- Boo: "Milestone **MVP** đã xong! Phần này được giải thoát rồi~ Boo nhẹ nhõm!"
- Tạo cảm giác completion có ý nghĩa — không chỉ checkbox, mà là "letting go"
- Ghost metaphor: ghost tồn tại vì unfinished business, hoàn thành = peace

### "Phase Through Walls" Concept
Boo nhìn xuyên suốt mọi module:
- "Boo thấy **Skill React** đang learning, mà project **Boo Frontend** cũng dùng React — bạn đang học đúng thứ cần thiết đó~"
- Cross-reference giữa skills, projects, goals, tasks → tạo insights mà user tự mình không thấy

---

## XVI. Brand Gap Summary & Roadmap

### Prioritized by Impact

| Priority | Gap | Mô tả | Giải pháp hướng |
|---|---|---|---|
| **Critical** | Burnout Prevention | Boo chỉ push, không biết dừng | Detect overwork signals, "nghỉ ngơi" nudge |
| **Critical** | Escalation Safety | Guilt-trip có thể gây hại | Gentle mode, welcome back, extended absence handling |
| **High** | Intrinsic Motivation | Quá nặng extrinsic, thiếu WHY | Link task → goal → meaning trong nudges |
| **High** | Decision Support | "Làm gì" quan trọng hơn "làm bao nhiêu" | Smart priority suggestion, energy matching |
| **High** | Output vs Outcome | Đo output thay vì outcome | Definition of Done, outcome review, milestone-first metrics |
| **Medium** | Streak Forgiveness | Binary streak gây all-or-nothing | Partial credit, rest days, grace period |
| **Medium** | Planning Continuity | Daily ↔ Life Direction bị đứt | Visibility chain, Epic Meaning nudges, monthly planning |
| **Medium** | Work-Life Balance | Không phân biệt work/rest | Weekend mode, quiet hours, reduce push khi đã productive |
| **Medium** | Reflection Feedback Loop | Viết reflection rồi quên | Structured questions, reference past reflections, track follow-through |
| **Low** | Celebration Habituation | Same confetti mãi = nhàm | Tiered celebrations, surprise achievements, escalating rewards |
| **Low** | Onboarding | Day 1 trống rỗng | Guided onboarding journey, progressive disclosure |
| **Low** | Ghost Metaphor Depth | Chỉ dùng "haunt" | Rest in Peace, Phase Through Walls, cultural depth |
