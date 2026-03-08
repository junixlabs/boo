import type { DailyFocus } from '@/features/daily-focus/types'

export interface DashboardToday {
  date: string
  daily_focuses: DailyFocus[]
  active_projects: {
    id: number
    title: string
    type: string
    priority: number
    tasks_count: number
    tasks_done_count: number
  }[]
  overdue_tasks: {
    id: number
    title: string
    due_date: string
    project: { id: number; title: string } | null
  }[]
  recent_ideas_count: number
  tasks_completed_this_week: number
}
