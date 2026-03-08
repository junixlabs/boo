import { Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Goal } from '../types'

const statusVariant: Record<string, 'default' | 'secondary' | 'outline'> = {
  active: 'default',
  completed: 'outline',
  dropped: 'secondary',
}

interface GoalCardProps {
  goal: Goal
  onEdit: (goal: Goal) => void
  onDelete: (id: number) => void
}

export function GoalCard({ goal, onEdit, onDelete }: GoalCardProps) {
  return (
    <div className="flex items-start gap-3 rounded-md border p-3">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">{goal.title}</p>
          <Badge variant={statusVariant[goal.status]}>
            {{ active: 'Active', completed: 'Completed', dropped: 'Dropped' }[goal.status]}
          </Badge>
          <Badge variant="outline">
            {{ yearly: 'Yearly', quarterly: 'Quarterly' }[goal.timeframe]}
          </Badge>
        </div>
        {goal.description && <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{goal.description}</p>}
        {goal.target_date && <p className="mt-1 text-xs text-muted-foreground">Target: {goal.target_date}</p>}
      </div>
      <div className="flex gap-1">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(goal)}>
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onDelete(goal.id)}>
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}
