import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { projectsApi } from '../api/projects.api'
import type { ProjectFilters, ProjectPayload, ProjectStatus } from '../types'

export const projectKeys = {
  all: ['projects'] as const,
  list: (filters?: ProjectFilters) => ['projects', 'list', filters] as const,
  detail: (id: number) => ['projects', id] as const,
  commits: (id: number) => ['projects', id, 'commits'] as const,
}

export function useProjects(filters?: ProjectFilters) {
  return useQuery({
    queryKey: projectKeys.list(filters),
    queryFn: () => projectsApi.list(filters).then((r) => r.data),
  })
}

export function useProject(id: number) {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: () => projectsApi.get(id).then((r) => r.data.data),
  })
}

export function useCreateProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: ProjectPayload) => projectsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: projectKeys.all }),
  })
}

export function useUpdateProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ProjectPayload> }) =>
      projectsApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: projectKeys.all }),
  })
}

export function useUpdateProjectStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: ProjectStatus }) =>
      projectsApi.updateStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: projectKeys.all }),
  })
}

export function useDeleteProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => projectsApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: projectKeys.all }),
  })
}

export function useProjectCommits(projectId: number) {
  return useQuery({
    queryKey: projectKeys.commits(projectId),
    queryFn: () => projectsApi.getCommits(projectId).then((r) => r.data.data),
    enabled: projectId > 0,
  })
}
