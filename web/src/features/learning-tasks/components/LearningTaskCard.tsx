import { Pencil, Trash2, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { LearningTask, LearningTaskStatus } from '../types'

const statusLabels: Record<LearningTaskStatus, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
}

interface LearningTaskCardProps {
  task: LearningTask
  onStatusChange: (id: number, status: LearningTaskStatus) => void
  onEdit: (task: LearningTask) => void
  onDelete: (id: number) => void
}

export function LearningTaskCard({ task, onStatusChange, onEdit, onDelete }: LearningTaskCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-md border p-2 pl-3">
      <div className="min-w-0 flex-1">
        <p className={`text-sm ${task.status === 'done' ? 'line-through text-muted-foreground' : ''}`}>{task.title}</p>
        {task.description && <p className="text-xs text-muted-foreground line-clamp-1">{task.description}</p>}
      </div>
      {task.resource_url && (
        <a href={task.resource_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      )}
      <Select value={task.status} onValueChange={(v) => onStatusChange(task.id, v as LearningTaskStatus)}>
        <SelectTrigger className="h-7 w-28 text-xs">
          <SelectValue>{statusLabels[task.status]}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todo">To Do</SelectItem>
          <SelectItem value="in_progress">In Progress</SelectItem>
          <SelectItem value="done">Done</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(task)}>
        <Pencil className="h-3.5 w-3.5" />
      </Button>
      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onDelete(task.id)}>
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  )
}
