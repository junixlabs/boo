import api from '@/lib/axios'
import type { ApiResponse } from '@/types/api'
import type { Skill, SkillPayload, SkillFilters } from '../types'

export const skillsApi = {
  list: (params?: SkillFilters) =>
    api.get<ApiResponse<Skill[]>>('/skills', { params }),

  create: (data: SkillPayload) =>
    api.post<ApiResponse<Skill>>('/skills', data),

  update: (id: number, data: Partial<SkillPayload>) =>
    api.put<ApiResponse<Skill>>(`/skills/${id}`, data),

  delete: (id: number) =>
    api.delete(`/skills/${id}`),

  syncProjects: (id: number, projectIds: number[]) =>
    api.post<ApiResponse<Skill>>(`/skills/${id}/projects`, { project_ids: projectIds }),
}
