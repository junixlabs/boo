import api from '@/lib/axios'
import type { ApiResponse } from '@/types/api'
import type { SkillCategory, SkillCategoryPayload } from '../types'

export const skillCategoriesApi = {
  list: () =>
    api.get<ApiResponse<SkillCategory[]>>('/skill-categories'),

  create: (data: SkillCategoryPayload) =>
    api.post<ApiResponse<SkillCategory>>('/skill-categories', data),

  update: (id: number, data: Partial<SkillCategoryPayload>) =>
    api.put<ApiResponse<SkillCategory>>(`/skill-categories/${id}`, data),

  delete: (id: number) =>
    api.delete(`/skill-categories/${id}`),
}
