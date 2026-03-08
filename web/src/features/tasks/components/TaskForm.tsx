import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useProjects } from '@/features/projects/hooks/useProjects'
import type { Task, TaskPayload, TaskPriority } from '../types'

interface TaskFormProps {
  initial?: Task
  defaultProjectId?: number
  onSubmit: (data: TaskPayload) => void
  isPending?: boolean
}

export function TaskForm({ initial, defaultProjectId, onSubmit, isPending }: TaskFormProps) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [expectedOutcome, setExpectedOutcome] = useState(initial?.expected_outcome ?? '')
  const [projectId, setProjectId] = useState(String(initial?.project_id ?? defaultProjectId ?? ''))
  const [priority, setPriority] = useState<TaskPriority>(initial?.priority ?? 'medium')
  const [dueDate, setDueDate] = useState(initial?.due_date ?? '')

  const { data: projectsData } = useProjects({ status: 'active', per_page: 100 })
  const projects = projectsData?.data ?? []

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit({
      title,
      description: description || null,
      expected_outcome: expectedOutcome || null,
      project_id: projectId ? Number(projectId) : null,
      priority,
      due_date: dueDate || null,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="expected_outcome">Expected Outcome</Label>
        <Input id="expected_outcome" value={expectedOutcome} onChange={(e) => setExpectedOutcome(e.target.value)} placeholder="What does done look like?" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Project</Label>
          <Select value={projectId} onValueChange={(v) => setProjectId(v ?? '')}>
            <SelectTrigger><SelectValue>{projectId ? projects.find(p => String(p.id) === projectId)?.title : 'No project'}</SelectValue></SelectTrigger>
            <SelectContent>
              <SelectItem value="">No project</SelectItem>
              {projects.map((p) => (
                <SelectItem key={p.id} value={String(p.id)}>{p.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Priority</Label>
          <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)}>
            <SelectTrigger><SelectValue>{{ high: 'High', medium: 'Medium', low: 'Low' }[priority]}</SelectValue></SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="due_date">Due Date</Label>
        <Input id="due_date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Saving...' : initial ? 'Update Task' : 'Create Task'}
      </Button>
    </form>
  )
}
