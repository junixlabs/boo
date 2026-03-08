import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { skillCategoriesApi } from '../api/skill-categories.api'
import type { SkillCategoryPayload } from '../types'

export const categoryKeys = {
  all: ['skill-categories'] as const,
}

export function useSkillCategories() {
  return useQuery({
    queryKey: categoryKeys.all,
    queryFn: () => skillCategoriesApi.list().then((r) => r.data.data),
  })
}

export function useCreateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: SkillCategoryPayload) => skillCategoriesApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: categoryKeys.all }),
  })
}

export function useUpdateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<SkillCategoryPayload> }) =>
      skillCategoriesApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: categoryKeys.all }),
  })
}

export function useDeleteCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => skillCategoriesApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: categoryKeys.all }),
  })
}
