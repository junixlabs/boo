import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { aiApi } from '../api/ai.api'

export const nudgeKeys = {
  all: ['nudges'] as const,
}

export function useNudges() {
  return useQuery({
    queryKey: nudgeKeys.all,
    queryFn: () => aiApi.getNudges().then((r) => r.data.data),
    refetchInterval: 5 * 60 * 1000, // refresh every 5 min
  })
}

export function useDismissNudge() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (type: string) => aiApi.dismissNudge(type),
    onSuccess: () => qc.invalidateQueries({ queryKey: nudgeKeys.all }),
  })
}
