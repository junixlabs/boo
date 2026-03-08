import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { dailyFocusApi } from '../api/daily-focus.api'
import type { DailyFocusPayload, ReorderPayload } from '../types'

export const focusKeys = {
  all: ['daily-focus'] as const,
  list: (date?: string) => ['daily-focus', 'list', date] as const,
  suggestions: ['daily-focus', 'suggestions'] as const,
}

export function useDailyFocus(date?: string) {
  return useQuery({
    queryKey: focusKeys.list(date),
    queryFn: () => dailyFocusApi.list(date).then((r) => r.data.data),
  })
}

export function useFocusSuggestions() {
  return useQuery({
    queryKey: focusKeys.suggestions,
    queryFn: () => dailyFocusApi.suggestions().then((r) => r.data.data),
    staleTime: 5 * 60 * 1000,
  })
}

export function useAddFocus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: DailyFocusPayload) => dailyFocusApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: focusKeys.all })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useUpdateFocus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<DailyFocusPayload> }) =>
      dailyFocusApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: focusKeys.all }),
  })
}

export function useDeleteFocus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => dailyFocusApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: focusKeys.all })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useReorderFocus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: ReorderPayload) => dailyFocusApi.reorder(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: focusKeys.all }),
  })
}
