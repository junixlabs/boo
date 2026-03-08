import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useProjects } from '@/features/projects/hooks/useProjects'
import type { Idea, ConvertIdeaPayload } from '../types'

interface ConvertIdeaDialogProps {
  idea: Idea | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConvert: (id: number, data: ConvertIdeaPayload) => void
  isPending?: boolean
}

export function ConvertIdeaDialog({ idea, open, onOpenChange, onConvert, isPending }: ConvertIdeaDialogProps) {
  const [convertTo, setConvertTo] = useState<'project' | 'task'>('task')
  const [projectId, setProjectId] = useState('')
  const { data: projectsData } = useProjects({ status: 'active', per_page: 100 })
  const projects = projectsData?.data ?? []

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!idea) return
    onConvert(idea.id, {
      convert_to: convertTo,
      project_id: convertTo === 'task' && projectId ? Number(projectId) : undefined,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Convert: {idea?.title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Convert to</Label>
            <Select value={convertTo} onValueChange={(v) => setConvertTo(v as 'project' | 'task')}>
              <SelectTrigger><SelectValue>{convertTo === 'project' ? 'Project' : 'Task'}</SelectValue></SelectTrigger>
              <SelectContent>
                <SelectItem value="project">Project</SelectItem>
                <SelectItem value="task">Task</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {convertTo === 'task' && (
            <div className="space-y-2">
              <Label>Assign to Project</Label>
              <Select value={projectId} onValueChange={(v) => setProjectId(v ?? '')}>
                <SelectTrigger><SelectValue>{projectId ? projects.find(p => String(p.id) === projectId)?.title : 'Select project'}</SelectValue></SelectTrigger>
                <SelectContent>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={String(p.id)}>{p.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Converting...' : 'Convert'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
