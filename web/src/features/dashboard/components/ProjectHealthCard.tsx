import { Badge } from '@/components/ui/badge'
import type { ProjectHealth } from '@/features/ai/types'

const healthConfig: Record<string, { label: string; className: string }> = {
  on_track: { label: 'On Track', className: 'bg-success/15 text-success border-success/30' },
  at_risk: { label: 'At Risk', className: 'bg-warning/15 text-warning border-warning/30' },
  blocked: { label: 'Blocked', className: 'bg-destructive/15 text-destructive border-destructive/30' },
}

export function ProjectHealthCard({ project }: { project: ProjectHealth }) {
  const config = healthConfig[project.health] ?? healthConfig.on_track
  return (
    <div className="flex items-center justify-between rounded-lg border bg-card p-3">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium truncate">{project.title}</p>
        <div className="mt-1 flex items-center gap-2">
          <div className="h-1.5 flex-1 rounded-full bg-secondary">
            <div
              className="h-1.5 rounded-full bg-primary transition-all"
              style={{ width: `${project.progress}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground">{project.progress}%</span>
        </div>
      </div>
      <Badge variant="outline" className={`ml-3 shrink-0 ${config.className}`}>
        {config.label}
      </Badge>
    </div>
  )
}
