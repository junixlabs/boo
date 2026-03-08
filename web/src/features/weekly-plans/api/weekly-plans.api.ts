import api from '@/lib/axios'
import type { ApiResponse } from '@/types/api'
import type { WeeklyPlan, WeeklyPlanIndex, WeeklyPlanPayload } from '../types'

export const weeklyPlansApi = {
  get: (params?: { week_start?: string }) =>
    api.get<ApiResponse<WeeklyPlanIndex>>('/weekly-plans', { params }),

  create: (data: WeeklyPlanPayload) =>
    api.post<ApiResponse<WeeklyPlan>>('/weekly-plans', data),

  update: (id: number, data: Partial<WeeklyPlanPayload>) =>
    api.put<ApiResponse<WeeklyPlan>>(`/weekly-plans/${id}`, data),
}
