import { Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Milestone, MilestoneStatus } from '../types'

const statusLabels: Record<MilestoneStatus, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
}

const statusVariant: Record<MilestoneStatus, 'secondary' | 'default' | 'outline'> = {
  pending: 'secondary',
  in_progress: 'default',
  completed: 'outline',
}

interface MilestoneCardProps {
  milestone: Milestone
  onStatusChange: (id: number, status: MilestoneStatus) => void
  onEdit: (milestone: Milestone) => void
  onDelete: (id: number) => void
}

export function MilestoneCard({ milestone, onStatusChange, onEdit, onDelete }: MilestoneCardProps) {
  const progress = milestone.tasks_count && milestone.tasks_count > 0
    ? Math.round(((milestone.tasks_done_count ?? 0) / milestone.tasks_count) * 100)
    : null

  return (
    <div className="flex items-start gap-3 rounded-md border p-3">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">{milestone.title}</p>
          <Badge variant={statusVariant[milestone.status]}>{statusLabels[milestone.status]}</Badge>
        </div>
        {milestone.description && <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{milestone.description}</p>}
        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
          {milestone.target_date && <span>Target: {milestone.target_date}</span>}
          {progress !== null && <span>{milestone.tasks_done_count}/{milestone.tasks_count} tasks ({progress}%)</span>}
        </div>
        {progress !== null && (
          <div className="mt-1.5 h-1 w-full rounded-full bg-secondary">
            <div className="h-1 rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>
      <div className="flex items-center gap-1">
        <Select value={milestone.status} onValueChange={(v) => onStatusChange(milestone.id, v as MilestoneStatus)}>
          <SelectTrigger className="h-7 w-28 text-xs">
            <SelectValue>{statusLabels[milestone.status]}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(milestone)}>
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onDelete(milestone.id)}>
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}
