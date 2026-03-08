import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { milestonesApi } from '../api/milestones.api'
import type { MilestoneFilters, MilestonePayload, MilestoneStatus } from '../types'
import { projectKeys } from '@/features/projects/hooks/useProjects'

export const milestoneKeys = {
  all: ['milestones'] as const,
  list: (projectId: number, filters?: MilestoneFilters) =>
    ['milestones', 'list', projectId, filters] as const,
}

export function useMilestones(projectId: number, filters?: MilestoneFilters) {
  return useQuery({
    queryKey: milestoneKeys.list(projectId, filters),
    queryFn: () => milestonesApi.list(projectId, filters).then((r) => r.data.data),
  })
}

export function useCreateMilestone() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: number; data: MilestonePayload }) =>
      milestonesApi.create(projectId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: milestoneKeys.all })
      qc.invalidateQueries({ queryKey: projectKeys.all })
    },
  })
}

export function useUpdateMilestone() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<MilestonePayload> }) =>
      milestonesApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: milestoneKeys.all }),
  })
}

export function useUpdateMilestoneStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: MilestoneStatus }) =>
      milestonesApi.updateStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: milestoneKeys.all })
      qc.invalidateQueries({ queryKey: projectKeys.all })
    },
  })
}

export function useDeleteMilestone() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => milestonesApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: milestoneKeys.all })
      qc.invalidateQueries({ queryKey: projectKeys.all })
    },
  })
}
