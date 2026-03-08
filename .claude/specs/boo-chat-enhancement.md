# Boo Chat Enhancement Plan

## Mục tiêu
Nâng cấp giao diện chat với Boo trở thành trải nghiệm chính của app. Boo là trợ lý đắc lực, luôn sẵn sàng, đơn giản, gọn gàng.

## Nguyên tắc
- Chat-first: Boo chat là primary interaction, nudges là secondary
- Simplicity: Giao diện tối giản, không overwhelm user
- Personality: Boo phải "sống" trong chat — biểu cảm, tone, phản hồi thông minh
- Mobile-first: Chat phải tuyệt vời trên điện thoại

---

## Phase A: Chat-First FloatingBoo (Refactor)

### A1. Unified Boo Drawer — Nudges in Chat Flow
**Hiện tại**: 2 tab riêng biệt (Nudges | Chat) — user phải switch qua lại.
**Đề xuất**: Gộp thành 1 view duy nhất:
- Khi mở drawer → vào thẳng chat
- Nudges hiển thị như Boo messages ở đầu chat (inline nudge cards)
- Nudge có thể dismiss ngay trong chat flow
- Badge count trên FAB vẫn giữ → nhưng không redirect sang tab riêng

**Lý do**: Brand doc nói Boo là companion, không phải notification center. Chat = relationship. Nudges tách riêng = notification bot (Anti-Clippy vi phạm).

### A2. Contextual Quick Chips
**Hiện tại**: 4 quick chips cố định.
**Đề xuất**: Quick chips thay đổi theo context:
- Morning (6-11h): "Hôm nay focus gì?", "Có gì cần làm?"
- Afternoon (11-17h): "Tiến độ hôm nay?", "Task nào stuck?"
- Evening (17-22h): "Tổng kết hôm nay", "Plan ngày mai"
- Nếu có nudges: chip liên quan đến nudge đầu tiên
- Nếu có overdue: "Mấy task overdue rồi?"

### A3. Boo Expression trong Chat
**Hiện tại**: BooAvatar luôn `default` trong chat bubbles.
**Đề xuất**: Boo expression thay đổi theo nội dung response:
- Response chứa "xong", "tốt", "giỏi" → happy
- Response chứa "chưa", "quên", "overdue" → sad
- Response chứa warning/deadline → spooky
- Default: default
- Có thể detect từ backend: thêm `boo_expression` vào SSE response

---

## Phase B: Chat UX Polish

### B1. Typing Indicator cải tiến
**Hiện tại**: "Boo đang suy nghĩ..." với avatar pulse.
**Đề xuất**: 3-dot bounce animation (như iMessage) với BooAvatar nhỏ bên cạnh. Trông tự nhiên hơn, ít "robot" hơn.

### B2. Chat History Persistence
**Hiện tại**: Chat history load từ API, nhưng chỉ 1 conversation.
**Đề xuất**: Hiển thị timestamp giữa các nhóm message (Today, Yesterday, etc.) để user thấy context temporal.

### B3. Rich Message Actions
**Hiện tại**: Boo response là pure text/markdown.
**Đề xuất**: Boo có thể gửi "action cards" inline:
- Khi nói về task → inline task card (title + status + nút đổi status)
- Khi nói về focus → nút "Set Focus" inline
- Khi gợi ý ưu tiên → danh sách có thể reorder

(Phức tạp — cần backend support. Xem xét sau.)

### B4. Chat Greeting theo thời gian
**Hiện tại**: "Boo ở đây rồi~ Hỏi Boo bất cứ điều gì nha!" (cố định).
**Đề xuất**: Greeting thay đổi:
- Morning: "Chào buổi sáng~ Hôm nay mình làm gì nha!"
- Afternoon: "Chiều rồi~ Cần Boo giúp gì không?"
- Evening: "Tối rồi~ Xem lại ngày hôm nay đi!"
- Nếu có streak: "🔥 {n} ngày liên tiếp! Tiếp tục nào~"
- Nếu absent >2 ngày: "Boo nhớ bạn~ Welcome back!"

---

## Phase C: Smart Boo (Intelligence)

### C1. Proactive Chat Messages
**Hiện tại**: Boo chỉ respond khi user hỏi.
**Đề xuất**: Khi user mở chat, nếu có context quan trọng, Boo tự gửi 1 message:
- "Boo thấy hôm nay bạn chưa set focus~ Muốn Boo gợi ý không?"
- "Task Deploy API stuck 5 ngày rồi... Cần break nhỏ ra không?"
- Chỉ 1 proactive message per session, không spam

### C2. Task Actions từ Chat
**Hiện tại**: Chat chỉ text-based.
**Đề xuất** (simple version):
- User: "Tạo task mới: Review PR" → Boo xác nhận → tạo task
- User: "Mark Deploy API done" → Boo xác nhận → update status
- Dùng structured output từ Gemini để parse intent

### C3. Daily Briefing
**Hiện tại**: User phải tự navigate tới Dashboard để xem tổng quan.
**Đề xuất**: Khi user mở chat lần đầu trong ngày, Boo auto-gửi daily briefing:
```
Chào buổi sáng~ Đây là update cho hôm nay:
- 📋 2 task overdue
- 🎯 Chưa set focus
- 🔥 Streak: 7 ngày
- 💡 3 ideas chờ xử lý

Bạn muốn set focus luôn không?
```

---

## Ưu tiên đề xuất

| # | Item | Impact | Effort | Đề xuất |
|---|------|--------|--------|---------|
| 1 | A1: Nudges in chat flow | High | Medium | Phase tiếp theo |
| 2 | B4: Chat greeting theo thời gian | High | Low | Làm ngay |
| 3 | A2: Contextual quick chips | Medium | Low | Làm ngay |
| 4 | A3: Boo expression trong chat | Medium | Low | Làm ngay |
| 5 | C3: Daily briefing | High | Medium | Sau A1 |
| 6 | B1: Typing indicator cải tiến | Low | Low | Khi rảnh |
| 7 | C1: Proactive chat | Medium | Medium | Cần backend |
| 8 | C2: Task actions từ chat | High | High | Cần backend structured output |
| 9 | B3: Rich message actions | High | High | Sau C2 |
