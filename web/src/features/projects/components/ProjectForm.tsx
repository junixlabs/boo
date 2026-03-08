import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Project, ProjectPayload, ProjectType } from '../types'

const projectTypes: { value: ProjectType; label: string }[] = [
  { value: 'company', label: 'Company' },
  { value: 'personal_startup', label: 'Personal Startup' },
  { value: 'experiment', label: 'Experiment' },
  { value: 'learning', label: 'Learning' },
]

interface ProjectFormProps {
  initial?: Project
  onSubmit: (data: ProjectPayload) => void
  isPending?: boolean
}

export function ProjectForm({ initial, onSubmit, isPending }: ProjectFormProps) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [type, setType] = useState<ProjectType>(initial?.type ?? 'personal_startup')
  const [priority, setPriority] = useState(String(initial?.priority ?? 3))
  const [startDate, setStartDate] = useState(initial?.start_date ?? '')
  const [targetDate, setTargetDate] = useState(initial?.target_date ?? '')
  const [repoUrl, setRepoUrl] = useState(initial?.repo_url ?? '')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit({
      title,
      description: description || null,
      type,
      priority: Number(priority),
      start_date: startDate || null,
      target_date: targetDate || null,
      repo_url: repoUrl || null,
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
        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Type *</Label>
          <Select value={type} onValueChange={(v) => setType(v as ProjectType)}>
            <SelectTrigger><SelectValue>{projectTypes.find(t => t.value === type)?.label}</SelectValue></SelectTrigger>
            <SelectContent>
              {projectTypes.map((t) => (
                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="priority">Priority (1-5)</Label>
          <Input id="priority" type="number" min={1} max={5} value={priority} onChange={(e) => setPriority(e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_date">Start Date</Label>
          <Input id="start_date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="target_date">Target Date</Label>
          <Input id="target_date" type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="repo_url">Repository URL</Label>
        <Input id="repo_url" type="url" value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} />
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Saving...' : initial ? 'Update Project' : 'Create Project'}
      </Button>
    </form>
  )
}
