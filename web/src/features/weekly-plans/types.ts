import type { Task } from '@/features/tasks/types'

export interface WeeklyPlan {
  id: number
  week_start: string
  completed_summary: string | null
  blocked_summary: string | null
  next_summary: string | null
  created_at: string
  updated_at: string
}

export interface WeeklyPlanIndex {
  plan: WeeklyPlan | null
  tasks_completed_this_week: Task[]
}

export interface WeeklyPlanPayload {
  week_start: string
  completed_summary?: string | null
  blocked_summary?: string | null
  next_summary?: string | null
}
