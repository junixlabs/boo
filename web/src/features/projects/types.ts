export type ProjectType = 'company' | 'personal_startup' | 'experiment' | 'learning'
export type ProjectStatus = 'active' | 'paused' | 'completed' | 'archived'

export interface Project {
  id: number
  title: string
  description: string | null
  type: ProjectType
  status: ProjectStatus
  vision: string | null
  priority: number
  repo_url: string | null
  start_date: string | null
  target_date: string | null
  tasks_count: number
  tasks_done_count: number
  created_at: string
  updated_at: string
}

export interface ProjectPayload {
  title: string
  description?: string | null
  type: ProjectType
  status?: ProjectStatus
  vision?: string | null
  priority?: number
  repo_url?: string | null
  start_date?: string | null
  target_date?: string | null
}

export interface ProjectFilters {
  status?: ProjectStatus
  type?: ProjectType
  sort?: string
  order?: 'asc' | 'desc'
  page?: number
  per_page?: number
}
