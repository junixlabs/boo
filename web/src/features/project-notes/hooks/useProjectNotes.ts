import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { projectNotesApi } from '../api/project-notes.api'
import type { ProjectNotePayload } from '../types'

export const noteKeys = {
  all: ['project-notes'] as const,
  list: (projectId: number) => ['project-notes', 'list', projectId] as const,
}

export function useProjectNotes(projectId: number) {
  return useQuery({
    queryKey: noteKeys.list(projectId),
    queryFn: () => projectNotesApi.list(projectId).then((r) => r.data.data),
  })
}

export function useCreateNote() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: number; data: ProjectNotePayload }) =>
      projectNotesApi.create(projectId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: noteKeys.all }),
  })
}

export function useUpdateNote() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ProjectNotePayload> }) =>
      projectNotesApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: noteKeys.all }),
  })
}

export function useDeleteNote() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => projectNotesApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: noteKeys.all }),
  })
}
