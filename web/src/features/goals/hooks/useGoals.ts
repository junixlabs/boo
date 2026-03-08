import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { goalsApi } from '../api/goals.api'
import type { GoalFilters, GoalPayload } from '../types'

export const goalKeys = {
  all: ['goals'] as const,
  list: (filters?: GoalFilters) => ['goals', 'list', filters] as const,
}

export function useGoals(filters?: GoalFilters) {
  return useQuery({
    queryKey: goalKeys.list(filters),
    queryFn: () => goalsApi.list(filters).then((r) => r.data.data),
  })
}

export function useCreateGoal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: GoalPayload) => goalsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: goalKeys.all })
      qc.invalidateQueries({ queryKey: ['life-direction'] })
    },
  })
}

export function useUpdateGoal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<GoalPayload> }) =>
      goalsApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: goalKeys.all })
      qc.invalidateQueries({ queryKey: ['life-direction'] })
    },
  })
}

export function useDeleteGoal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => goalsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: goalKeys.all })
      qc.invalidateQueries({ queryKey: ['life-direction'] })
    },
  })
}
