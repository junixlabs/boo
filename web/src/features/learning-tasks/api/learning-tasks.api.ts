import api from '@/lib/axios'
import type { ApiResponse } from '@/types/api'
import type { LearningTask, LearningTaskPayload, LearningTaskStatus } from '../types'

export const learningTasksApi = {
  list: (skillId: number) =>
    api.get<ApiResponse<LearningTask[]>>(`/skills/${skillId}/learning-tasks`),

  create: (skillId: number, data: LearningTaskPayload) =>
    api.post<ApiResponse<LearningTask>>(`/skills/${skillId}/learning-tasks`, data),

  update: (id: number, data: Partial<LearningTaskPayload>) =>
    api.put<ApiResponse<LearningTask>>(`/learning-tasks/${id}`, data),

  updateStatus: (id: number, status: LearningTaskStatus) =>
    api.patch<ApiResponse<LearningTask>>(`/learning-tasks/${id}/status`, { status }),

  delete: (id: number) =>
    api.delete(`/learning-tasks/${id}`),
}
