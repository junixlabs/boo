export type MilestoneStatus = 'pending' | 'in_progress' | 'completed'

export interface Milestone {
  id: number
  project_id: number
  title: string
  description: string | null
  status: MilestoneStatus
  target_date: string | null
  completed_at: string | null
  sort_order: number
  tasks_count?: number
  tasks_done_count?: number
  created_at: string
  updated_at: string
}

export interface MilestonePayload {
  title: string
  description?: string | null
  status?: MilestoneStatus
  target_date?: string | null
  sort_order?: number
}

export interface MilestoneFilters {
  status?: MilestoneStatus
}
