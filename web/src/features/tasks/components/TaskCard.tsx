import { Badge } from '@/components/ui/badge'
import { TaskStatusToggle } from './TaskStatusToggle'
import type { Task, TaskStatus } from '../types'

const priorityVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  high: 'destructive',
  medium: 'secondary',
  low: 'outline',
}

interface TaskCardProps {
  task: Task
  onStatusChange: (id: number, status: TaskStatus) => void
  onClick?: () => void
}

export function TaskCard({ task, onStatusChange, onClick }: TaskCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-md border p-3 transition-colors hover:bg-accent/50">
      <TaskStatusToggle status={task.status} onStatusChange={(s) => onStatusChange(task.id, s)} />
      <div className="min-w-0 flex-1 cursor-pointer" onClick={onClick}>
        <p className={`text-sm font-medium ${task.status === 'done' ? 'line-through text-muted-foreground' : ''}`}>
          {task.title}
        </p>
        <div className="mt-1 flex items-center gap-2">
          {task.project && <span className="text-xs text-muted-foreground">{task.project.title}</span>}
          {task.due_date && <span className="text-xs text-muted-foreground">{task.due_date}</span>}
        </div>
      </div>
      <Badge variant={priorityVariant[task.priority]}>{{ high: 'High', medium: 'Medium', low: 'Low' }[task.priority] ?? task.priority}</Badge>
    </div>
  )
}
