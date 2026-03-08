import api from '@/lib/axios'
import type { ApiResponse } from '@/types/api'
import type { Milestone, MilestonePayload, MilestoneStatus, MilestoneFilters } from '../types'

export const milestonesApi = {
  list: (projectId: number, params?: MilestoneFilters) =>
    api.get<ApiResponse<Milestone[]>>(`/projects/${projectId}/milestones`, { params }),

  create: (projectId: number, data: MilestonePayload) =>
    api.post<ApiResponse<Milestone>>(`/projects/${projectId}/milestones`, data),

  update: (id: number, data: Partial<MilestonePayload>) =>
    api.put<ApiResponse<Milestone>>(`/milestones/${id}`, data),

  updateStatus: (id: number, status: MilestoneStatus) =>
    api.patch<ApiResponse<Milestone>>(`/milestones/${id}/status`, { status }),

  delete: (id: number) =>
    api.delete(`/milestones/${id}`),
}
