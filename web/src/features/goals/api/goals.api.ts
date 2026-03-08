import api from '@/lib/axios'
import type { ApiResponse } from '@/types/api'
import type { Goal, GoalPayload, GoalFilters } from '../types'

export const goalsApi = {
  list: (params?: GoalFilters) =>
    api.get<ApiResponse<Goal[]>>('/goals', { params }),

  create: (data: GoalPayload) =>
    api.post<ApiResponse<Goal>>('/goals', data),

  update: (id: number, data: Partial<GoalPayload>) =>
    api.put<ApiResponse<Goal>>(`/goals/${id}`, data),

  delete: (id: number) =>
    api.delete(`/goals/${id}`),
}
