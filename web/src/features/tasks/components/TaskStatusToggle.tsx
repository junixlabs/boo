import { Circle, CheckCircle2, Clock, XCircle } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import type { TaskStatus } from '../types'

const statusConfig: Record<TaskStatus, { label: string; icon: typeof Circle; className: string }> = {
  todo: { label: 'To Do', icon: Circle, className: 'text-muted-foreground' },
  in_progress: { label: 'In Progress', icon: Clock, className: 'text-blue-500' },
  done: { label: 'Done', icon: CheckCircle2, className: 'text-green-500' },
  cancelled: { label: 'Cancelled', icon: XCircle, className: 'text-destructive' },
}

interface TaskStatusToggleProps {
  status: TaskStatus
  onStatusChange: (status: TaskStatus) => void
}

export function TaskStatusToggle({ status, onStatusChange }: TaskStatusToggleProps) {
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={`inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent ${config.className}`}>
        <Icon className="h-5 w-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {Object.entries(statusConfig).map(([key, cfg]) => {
          const StatusIcon = cfg.icon
          return (
            <DropdownMenuItem key={key} onClick={() => onStatusChange(key as TaskStatus)}>
              <StatusIcon className={`mr-2 h-4 w-4 ${cfg.className}`} />
              {cfg.label}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
