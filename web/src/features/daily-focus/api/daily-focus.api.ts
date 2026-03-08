import api from '@/lib/axios'
import type { ApiResponse } from '@/types/api'
import type { DailyFocus, DailyFocusPayload, FocusSuggestion, ReorderPayload } from '../types'

export const dailyFocusApi = {
  list: (date?: string) =>
    api.get<ApiResponse<DailyFocus[]>>('/daily-focus', { params: { date } }),

  create: (data: DailyFocusPayload) =>
    api.post<ApiResponse<DailyFocus>>('/daily-focus', data),

  update: (id: number, data: Partial<DailyFocusPayload>) =>
    api.put<ApiResponse<DailyFocus>>(`/daily-focus/${id}`, data),

  delete: (id: number) =>
    api.delete(`/daily-focus/${id}`),

  suggestions: () =>
    api.get<ApiResponse<FocusSuggestion[]>>('/daily-focus/suggestions'),

  reorder: (data: ReorderPayload) =>
    api.post<ApiResponse<DailyFocus[]>>('/daily-focus/reorder', data),
}
