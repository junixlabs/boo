import api from '@/lib/axios'
import type { ApiResponse, PaginatedResponse } from '@/types/api'
import type { ConvertIdeaPayload, Idea, IdeaFilters, IdeaPayload } from '../types'

export const ideasApi = {
  list: (params?: IdeaFilters) =>
    api.get<PaginatedResponse<Idea>>('/ideas', { params }),

  create: (data: IdeaPayload) =>
    api.post<ApiResponse<Idea>>('/ideas', data),

  update: (id: number, data: Partial<IdeaPayload>) =>
    api.put<ApiResponse<Idea>>(`/ideas/${id}`, data),

  delete: (id: number) =>
    api.delete(`/ideas/${id}`),

  convert: (id: number, data: ConvertIdeaPayload) =>
    api.post<ApiResponse<{ idea: Idea; created: unknown }>>(`/ideas/${id}/convert`, data),

  discard: (id: number) =>
    api.patch<ApiResponse<Idea>>(`/ideas/${id}/discard`),
}
