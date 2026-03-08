import api from '@/lib/axios'
import type { ApiResponse, PaginatedResponse } from '@/types/api'
import type { Reflection, ReflectionPayload, ReflectionFilters } from '../types'

export const reflectionsApi = {
  list: (params?: ReflectionFilters) =>
    api.get<PaginatedResponse<Reflection>>('/reflections', { params }),

  create: (data: ReflectionPayload) =>
    api.post<ApiResponse<Reflection>>('/reflections', data),

  update: (id: number, data: Partial<ReflectionPayload>) =>
    api.put<ApiResponse<Reflection>>(`/reflections/${id}`, data),

  delete: (id: number) =>
    api.delete(`/reflections/${id}`),
}
