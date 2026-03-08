import api from '@/lib/axios'
import type { ApiResponse } from '@/types/api'
import type { FocusArea, FocusAreaPayload, FocusAreaFilters } from '../types'

export const focusAreasApi = {
  list: (params?: FocusAreaFilters) =>
    api.get<ApiResponse<FocusArea[]>>('/focus-areas', { params }),

  create: (data: FocusAreaPayload) =>
    api.post<ApiResponse<FocusArea>>('/focus-areas', data),

  update: (id: number, data: Partial<FocusAreaPayload>) =>
    api.put<ApiResponse<FocusArea>>(`/focus-areas/${id}`, data),

  delete: (id: number) =>
    api.delete(`/focus-areas/${id}`),
}
