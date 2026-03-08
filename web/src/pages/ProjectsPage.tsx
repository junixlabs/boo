import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PageHeader } from '@/components/common/PageHeader'
import { PageLoading } from '@/components/common/LoadingSpinner'
import { ProjectList } from '@/features/projects/components/ProjectList'
import { ProjectForm } from '@/features/projects/components/ProjectForm'
import { useProjects, useCreateProject } from '@/features/projects/hooks/useProjects'
import type { ProjectStatus } from '@/features/projects/types'

export default function ProjectsPage() {
  const [status, setStatus] = useState<ProjectStatus | 'all'>('all')
  const [createOpen, setCreateOpen] = useState(false)
  const filters = status !== 'all' ? { status } : undefined
  const { data, isLoading } = useProjects(filters)
  const createProject = useCreateProject()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Manage your projects"
        action={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> New Project
          </Button>
        }
      />
      <div className="flex gap-2">
        <Select value={status} onValueChange={(v) => setStatus(v as ProjectStatus | 'all')}>
          <SelectTrigger className="w-40"><SelectValue>{{ all: 'All Status', active: 'Active', paused: 'Paused', completed: 'Completed', archived: 'Archived' }[status]}</SelectValue></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {isLoading ? <PageLoading /> : <ProjectList projects={data?.data ?? []} />}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>New Project</DialogTitle></DialogHeader>
          <ProjectForm
            onSubmit={(d) => createProject.mutate(d, { onSuccess: () => setCreateOpen(false) })}
            isPending={createProject.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
