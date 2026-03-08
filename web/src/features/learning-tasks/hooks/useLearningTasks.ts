import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { learningTasksApi } from '../api/learning-tasks.api'
import type { LearningTaskPayload, LearningTaskStatus } from '../types'
import { skillKeys } from '@/features/skills/hooks/useSkills'

export const learningTaskKeys = {
  all: ['learning-tasks'] as const,
  list: (skillId: number) => ['learning-tasks', 'list', skillId] as const,
}

export function useLearningTasks(skillId: number) {
  return useQuery({
    queryKey: learningTaskKeys.list(skillId),
    queryFn: () => learningTasksApi.list(skillId).then((r) => r.data.data),
  })
}

export function useCreateLearningTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ skillId, data }: { skillId: number; data: LearningTaskPayload }) =>
      learningTasksApi.create(skillId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: learningTaskKeys.all })
      qc.invalidateQueries({ queryKey: skillKeys.all })
    },
  })
}

export function useUpdateLearningTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<LearningTaskPayload> }) =>
      learningTasksApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: learningTaskKeys.all }),
  })
}

export function useUpdateLearningTaskStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: LearningTaskStatus }) =>
      learningTasksApi.updateStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: learningTaskKeys.all })
      qc.invalidateQueries({ queryKey: skillKeys.all })
    },
  })
}

export function useDeleteLearningTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => learningTasksApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: learningTaskKeys.all })
      qc.invalidateQueries({ queryKey: skillKeys.all })
    },
  })
}
