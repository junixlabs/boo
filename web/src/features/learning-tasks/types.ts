export type LearningTaskStatus = 'todo' | 'in_progress' | 'done'

export interface LearningTask {
  id: number
  skill_id: number
  title: string
  description: string | null
  status: LearningTaskStatus
  resource_url: string | null
  completed_at: string | null
  created_at: string
  updated_at: string
}

export interface LearningTaskPayload {
  title: string
  description?: string | null
  status?: LearningTaskStatus
  resource_url?: string | null
}
