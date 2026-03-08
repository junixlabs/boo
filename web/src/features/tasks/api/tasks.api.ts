import api from '@/lib/axios'
import type { ApiResponse, PaginatedResponse } from '@/types/api'
import type { Task, TaskFilters, TaskPayload, TaskStatus } from '../types'

export const tasksApi = {
  list: (params?: TaskFilters) =>
    api.get<PaginatedResponse<Task>>('/tasks', { params }),

  get: (id: number) =>
    api.get<ApiResponse<Task>>(`/tasks/${id}`),

  create: (data: TaskPayload) =>
    api.post<ApiResponse<Task>>('/tasks', data),

  update: (id: number, data: Partial<TaskPayload>) =>
    api.put<ApiResponse<Task>>(`/tasks/${id}`, data),

  updateStatus: (id: number, status: TaskStatus) =>
    api.patch<ApiResponse<Task>>(`/tasks/${id}/status`, { status }),

  delete: (id: number) =>
    api.delete(`/tasks/${id}`),
}
