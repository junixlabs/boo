import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { focusAreasApi } from '../api/focus-areas.api'
import type { FocusAreaFilters, FocusAreaPayload } from '../types'

export const focusAreaKeys = {
  all: ['focus-areas'] as const,
  list: (filters?: FocusAreaFilters) => ['focus-areas', 'list', filters] as const,
}

export function useFocusAreas(filters?: FocusAreaFilters) {
  return useQuery({
    queryKey: focusAreaKeys.list(filters),
    queryFn: () => focusAreasApi.list(filters).then((r) => r.data.data),
  })
}

export function useCreateFocusArea() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: FocusAreaPayload) => focusAreasApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: focusAreaKeys.all })
      qc.invalidateQueries({ queryKey: ['life-direction'] })
    },
  })
}

export function useUpdateFocusArea() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<FocusAreaPayload> }) =>
      focusAreasApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: focusAreaKeys.all })
      qc.invalidateQueries({ queryKey: ['life-direction'] })
    },
  })
}

export function useDeleteFocusArea() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => focusAreasApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: focusAreaKeys.all })
      qc.invalidateQueries({ queryKey: ['life-direction'] })
    },
  })
}
