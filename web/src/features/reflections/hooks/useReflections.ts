import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { reflectionsApi } from '../api/reflections.api'
import type { ReflectionPayload, ReflectionFilters } from '../types'

export const reflectionKeys = {
  all: ['reflections'] as const,
  list: (filters?: ReflectionFilters) => ['reflections', 'list', filters] as const,
}

export function useReflections(filters?: ReflectionFilters) {
  return useQuery({
    queryKey: reflectionKeys.list(filters),
    queryFn: () => reflectionsApi.list(filters).then((r) => r.data),
  })
}

export function useCreateReflection() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: ReflectionPayload) => reflectionsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: reflectionKeys.all }),
  })
}

export function useUpdateReflection() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ReflectionPayload> }) =>
      reflectionsApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: reflectionKeys.all }),
  })
}

export function useDeleteReflection() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => reflectionsApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: reflectionKeys.all }),
  })
}
