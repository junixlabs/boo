export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert'

export interface Skill {
  id: number
  category_id: number
  name: string
  current_level: SkillLevel
  target_level: SkillLevel
  notes: string | null
  learning_tasks_count?: number
  learning_tasks_done_count?: number
  projects?: { id: number; title: string }[]
  created_at: string
  updated_at: string
}

export interface SkillPayload {
  category_id: number
  name: string
  current_level?: SkillLevel
  target_level?: SkillLevel
  notes?: string | null
}

export interface SkillFilters {
  category_id?: number
}
