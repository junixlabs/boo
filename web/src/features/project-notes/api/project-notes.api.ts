import api from '@/lib/axios'
import type { ApiResponse } from '@/types/api'
import type { ProjectNote, ProjectNotePayload } from '../types'

export const projectNotesApi = {
  list: (projectId: number) =>
    api.get<ApiResponse<ProjectNote[]>>(`/projects/${projectId}/notes`),

  create: (projectId: number, data: ProjectNotePayload) =>
    api.post<ApiResponse<ProjectNote>>(`/projects/${projectId}/notes`, data),

  update: (id: number, data: Partial<ProjectNotePayload>) =>
    api.put<ApiResponse<ProjectNote>>(`/notes/${id}`, data),

  delete: (id: number) =>
    api.delete(`/notes/${id}`),
}
