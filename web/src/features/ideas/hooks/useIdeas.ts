import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ideasApi } from '../api/ideas.api'
import type { ConvertIdeaPayload, IdeaFilters, IdeaPayload } from '../types'
import { projectKeys } from '@/features/projects/hooks/useProjects'
import { taskKeys } from '@/features/tasks/hooks/useTasks'

export const ideaKeys = {
  all: ['ideas'] as const,
  list: (filters?: IdeaFilters) => ['ideas', 'list', filters] as const,
}

export function useIdeas(filters?: IdeaFilters) {
  return useQuery({
    queryKey: ideaKeys.list(filters),
    queryFn: () => ideasApi.list(filters).then((r) => r.data),
  })
}

export function useCreateIdea() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: IdeaPayload) => ideasApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ideaKeys.all }),
  })
}

export function useUpdateIdea() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<IdeaPayload> }) =>
      ideasApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ideaKeys.all }),
  })
}

export function useDeleteIdea() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => ideasApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ideaKeys.all }),
  })
}

export function useConvertIdea() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ConvertIdeaPayload }) =>
      ideasApi.convert(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ideaKeys.all })
      qc.invalidateQueries({ queryKey: projectKeys.all })
      qc.invalidateQueries({ queryKey: taskKeys.all })
    },
  })
}

export function useDiscardIdea() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => ideasApi.discard(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ideaKeys.all }),
  })
}
