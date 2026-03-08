export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'cancelled'
export type TaskPriority = 'high' | 'medium' | 'low'

export interface Task {
  id: number
  user_id: number
  project_id: number | null
  milestone_id: number | null
  title: string
  description: string | null
  expected_outcome: string | null
  status: TaskStatus
  priority: TaskPriority
  due_date: string | null
  completed_at: string | null
  sort_order: number
  project: { id: number; title: string } | null
  milestone: { id: number; title: string } | null
  is_focused_today: boolean
  created_at: string
  updated_at: string
}

export interface TaskPayload {
  title: string
  description?: string | null
  expected_outcome?: string | null
  project_id?: number | null
  status?: TaskStatus
  priority?: TaskPriority
  due_date?: string | null
  sort_order?: number
}

export interface TaskFilters {
  project_id?: number
  status?: string
  priority?: TaskPriority
  due_date_from?: string
  due_date_to?: string
  sort?: string
  order?: 'asc' | 'desc'
  page?: number
  per_page?: number
}
