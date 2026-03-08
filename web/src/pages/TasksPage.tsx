import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PageHeader } from '@/components/common/PageHeader'
import { PageLoading } from '@/components/common/LoadingSpinner'
import { TaskList } from '@/features/tasks/components/TaskList'
import { TaskForm } from '@/features/tasks/components/TaskForm'
import { useTasks, useCreateTask, useUpdateTaskStatus, useUpdateTask } from '@/features/tasks/hooks/useTasks'
import type { Task, TaskPriority } from '@/features/tasks/types'

export default function TasksPage() {
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [createOpen, setCreateOpen] = useState(false)
  const [editTask, setEditTask] = useState<Task | null>(null)

  const filters = {
    ...(statusFilter !== 'all' && { status: statusFilter }),
    ...(priorityFilter !== 'all' && { priority: priorityFilter as TaskPriority }),
  }
  const { data, isLoading } = useTasks(filters)
  const createTask = useCreateTask()
  const updateTaskStatus = useUpdateTaskStatus()
  const updateTask = useUpdateTask()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tasks"
        description="All your tasks across projects"
        action={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> New Task
          </Button>
        }
      />
      <div className="flex gap-2">
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? 'all')}>
          <SelectTrigger className="w-36"><SelectValue>{{ all: 'All Status', todo: 'To Do', in_progress: 'In Progress', done: 'Done', cancelled: 'Cancelled' }[statusFilter]}</SelectValue></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="todo">To Do</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="done">Done</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v ?? 'all')}>
          <SelectTrigger className="w-36"><SelectValue>{{ all: 'All Priority', high: 'High', medium: 'Medium', low: 'Low' }[priorityFilter]}</SelectValue></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {isLoading ? (
        <PageLoading />
      ) : (
        <TaskList
          tasks={data?.data ?? []}
          onStatusChange={(id, s) => updateTaskStatus.mutate({ id, status: s })}
          onTaskClick={(t) => setEditTask(t)}
        />
      )}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>New Task</DialogTitle></DialogHeader>
          <TaskForm
            onSubmit={(d) => createTask.mutate(d, { onSuccess: () => setCreateOpen(false) })}
            isPending={createTask.isPending}
          />
        </DialogContent>
      </Dialog>
      <Dialog open={!!editTask} onOpenChange={(o) => !o && setEditTask(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Task</DialogTitle></DialogHeader>
          {editTask && (
            <TaskForm
              initial={editTask}
              onSubmit={(d) => updateTask.mutate({ id: editTask.id, data: d }, { onSuccess: () => setEditTask(null) })}
              isPending={updateTask.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
