import { FolderKanban } from 'lucide-react'
import { ProjectCard } from './ProjectCard'
import { EmptyState } from '@/components/common/EmptyState'
import type { Project } from '../types'

export function ProjectList({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return <EmptyState icon={FolderKanban} title="No projects yet" description="Create your first project to get started" />
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((p) => (
        <ProjectCard key={p.id} project={p} />
      ))}
    </div>
  )
}
