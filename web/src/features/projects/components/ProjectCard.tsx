import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProjectStatusBadge } from './ProjectStatusBadge'
import type { Project } from '../types'

export function ProjectCard({ project }: { project: Project }) {
  const progress = project.tasks_count > 0
    ? Math.round((project.tasks_done_count / project.tasks_count) * 100)
    : 0

  return (
    <Link to={`/projects/${project.id}`}>
      <Card className="transition-colors hover:border-primary/50">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">{project.title}</CardTitle>
          <ProjectStatusBadge status={project.status} />
        </CardHeader>
        <CardContent>
          {project.description && (
            <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
          )}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {project.tasks_done_count}/{project.tasks_count} tasks
            </span>
            <span className="font-medium">{progress}%</span>
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-secondary">
            <div className="h-1.5 rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
