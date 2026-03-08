import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { skillsApi } from '../api/skills.api'
import type { SkillPayload, SkillFilters } from '../types'

export const skillKeys = {
  all: ['skills'] as const,
  list: (filters?: SkillFilters) => ['skills', 'list', filters] as const,
}

export function useSkills(filters?: SkillFilters) {
  return useQuery({
    queryKey: skillKeys.list(filters),
    queryFn: () => skillsApi.list(filters).then((r) => r.data.data),
  })
}

export function useCreateSkill() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: SkillPayload) => skillsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: skillKeys.all }),
  })
}

export function useUpdateSkill() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<SkillPayload> }) =>
      skillsApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: skillKeys.all }),
  })
}

export function useDeleteSkill() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => skillsApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: skillKeys.all }),
  })
}

export function useSyncProjects() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, projectIds }: { id: number; projectIds: number[] }) =>
      skillsApi.syncProjects(id, projectIds),
    onSuccess: () => qc.invalidateQueries({ queryKey: skillKeys.all }),
  })
}
