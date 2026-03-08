# Boo UI/UX Refactor & Implementation Plan

## Gap Analysis Summary

**Backend: 80 routes (complete) | Frontend: 80/80 routes covered (100%)**

All 7 previously missing frontend API integrations have been implemented.

---

## Implementation Plan (4 Phases) - ALL COMPLETE

### Phase A: Boo Theme (CSS-only, zero component changes) - COMPLETE
> Swap colors + fonts. All 33 components auto-update via CSS variables.

- [x] A1. Install fonts: `@fontsource/inter`, `@fontsource/jetbrains-mono` (replaced `@fontsource-variable/geist`)
- [x] A2. Rewrite `index.css` CSS variables: Boo monochromatic palette (dark + light)
- [x] A3. Setup ThemeProvider (`next-themes`, wrap App, default dark)
- [x] A4. Add dark/light toggle button in Header
- [x] A5. Update Sidebar brand: "LifeStack" -> Boo avatar SVG + "Boo" text (solid purple)
- [x] A6. Verify `npx tsc --noEmit` + vite build

### Phase B: Boo Nudge System (new feature, 2 backend APIs) - COMPLETE
> Floating Boo + nudge cards with escalation

- [x] B1. Types: Nudge, NudgeType, BooExpression (6 expressions, 11 nudge types)
- [x] B2. API: `getNudges()`, `dismissNudge(type)`
- [x] B3. Hooks: `useNudges()` query + `useDismissNudge()` mutation
- [x] B4. Component: `BooAvatar.tsx` - SVG ghost with expression prop
- [x] B5. Component: `NudgeCard.tsx` - priority border-left + dismiss
- [x] B6. Component: `FloatingBoo.tsx` - FAB bottom-right + nudge popup
- [x] B7. Integrate FloatingBoo into AppShell (global)

### Phase C: Boo AI Chat (new feature, 3 backend APIs - SSE streaming) - COMPLETE
> Conversational chat interface with SSE streaming

- [x] C1. Types: ChatMessage, ChatRequest, ConversationHistory
- [x] C2. API: `chat()` (SSE fetch), `chatHistory()`, `clearChat()`
- [x] C3. Hooks: `useSendMessage()` streaming, `useClearChat()`, `useChatHistory()`
- [x] C4. Component: `ChatBubble.tsx` + `StreamingBubble.tsx`
- [x] C5. Component: `ChatPanel.tsx` - full chat UI
- [x] C6. Refactor AiPage: ChatPanel (2/3) + Quick Actions sidebar (1/3)

### Phase D: Enhanced Dashboard + GitHub (2 backend APIs) - COMPLETE
> Dashboard overview with project health, GitHub commits in project detail

- [x] D1. Types: DashboardOverview, ProjectHealth, SkillProgress, GitCommit
- [x] D2. API: `dashboard.overview()`, `projects.getCommits()`
- [x] D3. Hooks: `useDashboardOverview()`, `useProjectCommits()`
- [x] D4. Component: `ProjectHealthCard.tsx`
- [x] D5. Refactor DashboardView: project health row, weekly goals, skill progress
- [x] D6. Component: `CommitList.tsx`
- [x] D7. CommitList section in ProjectDetailPage (only if repo_url)

---

## Files Changed/Created

### Phase A (6 files)
- `web/package.json` - font swap
- `web/src/index.css` - full CSS variable rewrite (Boo palette)
- `web/src/app/App.tsx` - ThemeProvider wrapper
- `web/src/components/layout/Header.tsx` - dark/light toggle
- `web/src/components/layout/Sidebar.tsx` - Boo brand
- `web/src/components/layout/AppShell.tsx` - FloatingBoo integration

### Phase B (4 new files)
- `web/src/features/ai/components/BooAvatar.tsx`
- `web/src/features/ai/components/NudgeCard.tsx`
- `web/src/features/ai/components/FloatingBoo.tsx`
- `web/src/features/ai/hooks/useNudges.ts`

### Phase C (4 files)
- `web/src/features/ai/types.ts` - extended with all new types
- `web/src/features/ai/api/ai.api.ts` - 5 new API methods
- `web/src/features/ai/hooks/useChat.ts` - new
- `web/src/features/ai/components/ChatBubble.tsx` - new
- `web/src/features/ai/components/ChatPanel.tsx` - new
- `web/src/pages/AiPage.tsx` - refactored

### Phase D (5 files)
- `web/src/features/dashboard/api/dashboard.api.ts` - overview()
- `web/src/features/dashboard/hooks/useDashboardToday.ts` - useDashboardOverview()
- `web/src/features/dashboard/components/ProjectHealthCard.tsx` - new
- `web/src/features/dashboard/components/DashboardView.tsx` - enhanced
- `web/src/pages/DashboardPage.tsx` - uses overview
- `web/src/features/projects/api/projects.api.ts` - getCommits()
- `web/src/features/projects/hooks/useProjects.ts` - useProjectCommits()
- `web/src/features/projects/components/CommitList.tsx` - new
- `web/src/pages/ProjectDetailPage.tsx` - commits section
