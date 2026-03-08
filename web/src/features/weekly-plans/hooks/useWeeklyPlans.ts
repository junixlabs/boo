import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { weeklyPlansApi } from '../api/weekly-plans.api'
import type { WeeklyPlanPayload } from '../types'

export const weeklyPlanKeys = {
  all: ['weekly-plans'] as const,
  week: (weekStart?: string) => ['weekly-plans', weekStart] as const,
}

export function useWeeklyPlan(weekStart?: string) {
  return useQuery({
    queryKey: weeklyPlanKeys.week(weekStart),
    queryFn: () => weeklyPlansApi.get({ week_start: weekStart }).then((r) => r.data.data),
  })
}

export function useCreateWeeklyPlan() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: WeeklyPlanPayload) => weeklyPlansApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: weeklyPlanKeys.all }),
  })
}

export function useUpdateWeeklyPlan() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<WeeklyPlanPayload> }) =>
      weeklyPlansApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: weeklyPlanKeys.all }),
  })
}
