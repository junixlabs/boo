import { Badge } from '@/components/ui/badge'
import type { ProjectStatus } from '../types'

const statusConfig: Record<ProjectStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  active: { label: 'Active', variant: 'default' },
  paused: { label: 'Paused', variant: 'secondary' },
  completed: { label: 'Completed', variant: 'outline' },
  archived: { label: 'Archived', variant: 'secondary' },
}

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  const config = statusConfig[status]
  return <Badge variant={config.variant}>{config.label}</Badge>
}
