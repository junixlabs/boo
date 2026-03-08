import { CheckSquare } from 'lucide-react'
import { TaskCard } from './TaskCard'
import { EmptyState } from '@/components/common/EmptyState'
import type { Task, TaskStatus } from '../types'

interface TaskListProps {
  tasks: Task[]
  onStatusChange: (id: number, status: TaskStatus) => void
  onTaskClick?: (task: Task) => void
}

export function TaskList({ tasks, onStatusChange, onTaskClick }: TaskListProps) {
  if (tasks.length === 0) {
    return <EmptyState icon={CheckSquare} title="No tasks" description="Create a task to get started" />
  }

  return (
    <div className="space-y-2">
      {tasks.map((t) => (
        <TaskCard key={t.id} task={t} onStatusChange={onStatusChange} onClick={() => onTaskClick?.(t)} />
      ))}
    </div>
  )
}
