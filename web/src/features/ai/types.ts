// AI Action types (existing)
export interface AiWeeklySummaryRequest {
  week_start: string
}

export interface AiSuggestPrioritiesRequest {
  date: string
}

export interface AiReviewPromptRequest {
  type: 'weekly' | 'monthly'
  period_start: string
}

export interface AiResult {
  content: string
}

// Boo expressions
export type BooExpression = 'default' | 'happy' | 'sad' | 'angry' | 'dramatic' | 'spooky'

// Nudge types
export type NudgeType =
  | 'no_daily_focus'
  | 'overdue_tasks'
  | 'stale_project'
  | 'no_weekly_plan'
  | 'incomplete_reflection'
  | 'idle_ideas'
  | 'no_learning_progress'
  | 'missed_milestone'
  | 'goal_check_in'
  | 'pattern_insight'
  | 'priority_conflict'

export type NudgePriority = 'high' | 'medium' | 'low'

export interface Nudge {
  type: NudgeType
  priority: NudgePriority
  title: string
  message: string
  level: 1 | 2 | 3 | 4
  boo_expression: BooExpression
  data: Record<string, unknown> | null
}

// Chat types
export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp?: string
}

export interface ChatRequest {
  message: string
  conversation_id?: string
}

export interface ConversationHistory {
  conversation_id: string
  messages: ChatMessage[]
  created_at: string
  updated_at: string
}

// Dashboard overview types
export interface ProjectHealth {
  id: number
  title: string
  status: string
  health: 'on_track' | 'at_risk' | 'blocked'
  progress: number
  overdue_tasks: number
  total_tasks: number
}

export interface SkillProgress {
  id: number
  name: string
  current_level: string
  target_level: string
  learning_tasks_total: number
  learning_tasks_completed: number
}

export interface DashboardOverview {
  today_focus: unknown[]
  active_projects: unknown[]
  project_health: ProjectHealth[]
  weekly_goals: { completed: number; total: number }
  skill_progress: SkillProgress[]
  recent_notes: unknown[]
  ideas_inbox_count: number
  overdue_tasks_count: number
}

// Git types
export interface GitCommit {
  sha: string
  message: string
  author: string
  date: string
  url: string
}
