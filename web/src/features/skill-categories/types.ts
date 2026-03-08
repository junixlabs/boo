export interface SkillCategory {
  id: number
  name: string
  sort_order: number
  skills_count?: number
  created_at: string
  updated_at: string
}

export interface SkillCategoryPayload {
  name: string
  sort_order?: number
}
