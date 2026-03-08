export type ReflectionType = 'weekly' | 'monthly'

export interface Reflection {
  id: number
  type: ReflectionType
  period_start: string
  period_end: string
  went_well: string | null
  went_wrong: string | null
  to_improve: string | null
  projects_progress: string | null
  skills_improved: string | null
  mistakes: string | null
  opportunities: string | null
  created_at: string
  updated_at: string
}

export interface ReflectionPayload {
  type: ReflectionType
  period_start: string
  period_end: string
  went_well?: string | null
  went_wrong?: string | null
  to_improve?: string | null
  projects_progress?: string | null
  skills_improved?: string | null
  mistakes?: string | null
  opportunities?: string | null
}

export interface ReflectionFilters {
  type?: ReflectionType
  page?: number
  per_page?: number
}
