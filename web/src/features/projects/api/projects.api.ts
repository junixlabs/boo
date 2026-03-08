import api from '@/lib/axios'
import type { ApiResponse, PaginatedResponse } from '@/types/api'
import type { Project, ProjectFilters, ProjectPayload, ProjectStatus } from '../types'
import type { GitCommit } from '@/features/ai/types'

export const projectsApi = {
  list: (params?: ProjectFilters) =>
    api.get<PaginatedResponse<Project>>('/projects', { params }),

  get: (id: number) =>
    api.get<ApiResponse<Project>>(`/projects/${id}`),

  create: (data: ProjectPayload) =>
    api.post<ApiResponse<Project>>('/projects', data),

  update: (id: number, data: Partial<ProjectPayload>) =>
    api.put<ApiResponse<Project>>(`/projects/${id}`, data),

  updateStatus: (id: number, status: ProjectStatus) =>
    api.patch<ApiResponse<Project>>(`/projects/${id}/status`, { status }),

  delete: (id: number) =>
    api.delete(`/projects/${id}`),

  getCommits: (projectId: number) =>
    api.get<ApiResponse<GitCommit[]>>(`/projects/${projectId}/commits`),
}
