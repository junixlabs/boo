import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageLoading } from '@/components/common/LoadingSpinner'
import { EmptyState } from '@/components/common/EmptyState'
import { ProjectStatusBadge } from '@/features/projects/components/ProjectStatusBadge'
import { ProjectForm } from '@/features/projects/components/ProjectForm'
import { TaskList } from '@/features/tasks/components/TaskList'
import { TaskForm } from '@/features/tasks/components/TaskForm'
import { MilestoneCard } from '@/features/milestones/components/MilestoneCard'
import { MilestoneForm } from '@/features/milestones/components/MilestoneForm'
import { NoteCard } from '@/features/project-notes/components/NoteCard'
import { NoteForm } from '@/features/project-notes/components/NoteForm'
import { useProject, useUpdateProject, useUpdateProjectStatus, useDeleteProject, useProjectCommits } from '@/features/projects/hooks/useProjects'
import { useTasks, useUpdateTaskStatus, useCreateTask } from '@/features/tasks/hooks/useTasks'
import { useMilestones, useCreateMilestone, useUpdateMilestone, useUpdateMilestoneStatus, useDeleteMilestone } from '@/features/milestones/hooks/useMilestones'
import { useProjectNotes, useCreateNote, useUpdateNote, useDeleteNote } from '@/features/project-notes/hooks/useProjectNotes'
import type { ProjectStatus } from '@/features/projects/types'
import type { Milestone } from '@/features/milestones/types'
import type { ProjectNote } from '@/features/project-notes/types'
import { CommitList } from '@/features/projects/components/CommitList'

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const projectId = Number(id)

  const { data: project, isLoading } = useProject(projectId)
  const { data: tasksData } = useTasks({ project_id: projectId })
  const { data: milestones } = useMilestones(projectId)
  const { data: notes } = useProjectNotes(projectId)
  const { data: commits } = useProjectCommits(projectId)

  const updateProject = useUpdateProject()
  const updateStatus = useUpdateProjectStatus()
  const deleteProject = useDeleteProject()
  const updateTaskStatus = useUpdateTaskStatus()
  const createTask = useCreateTask()
  const createMilestone = useCreateMilestone()
  const updateMilestone = useUpdateMilestone()
  const updateMilestoneStatus = useUpdateMilestoneStatus()
  const deleteMilestone = useDeleteMilestone()
  const createNote = useCreateNote()
  const updateNote = useUpdateNote()
  const deleteNote = useDeleteNote()

  const [editOpen, setEditOpen] = useState(false)
  const [newTaskOpen, setNewTaskOpen] = useState(false)
  const [milestoneOpen, setMilestoneOpen] = useState(false)
  const [editMilestone, setEditMilestone] = useState<Milestone | null>(null)
  const [noteOpen, setNoteOpen] = useState(false)
  const [editNote, setEditNote] = useState<ProjectNote | null>(null)

  if (isLoading || !project) return <PageLoading />

  const progress = project.tasks_count > 0 ? Math.round((project.tasks_done_count / project.tasks_count) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate('/projects')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">{project.title}</h1>
        <ProjectStatusBadge status={project.status} />
        <div className="ml-auto flex gap-2">
          <Select value={project.status} onValueChange={(v) => updateStatus.mutate({ id: projectId, status: v as ProjectStatus })}>
            <SelectTrigger className="w-32"><SelectValue>{{ active: 'Active', paused: 'Paused', completed: 'Completed', archived: 'Archived' }[project.status]}</SelectValue></SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={() => setEditOpen(true)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => deleteProject.mutate(projectId, { onSuccess: () => navigate('/projects') })}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {project.description && <p className="text-muted-foreground">{project.description}</p>}

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold">{progress}%</p>
            <p className="text-xs text-muted-foreground">{project.tasks_done_count}/{project.tasks_count} tasks done</p>
            <div className="mt-2 h-1.5 rounded-full bg-secondary">
              <div className="h-1.5 rounded-full bg-primary" style={{ width: `${progress}%` }} />
            </div>
          </CardContent>
        </Card>
        {project.start_date && (
          <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Start</p><p className="font-medium">{project.start_date}</p></CardContent></Card>
        )}
        {project.target_date && (
          <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Target</p><p className="font-medium">{project.target_date}</p></CardContent></Card>
        )}
      </div>

      {/* Milestones */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Milestones</CardTitle>
          <Button size="sm" onClick={() => { setEditMilestone(null); setMilestoneOpen(true) }}>
            <Plus className="mr-2 h-4 w-4" /> Add Milestone
          </Button>
        </CardHeader>
        <CardContent>
          {!milestones || milestones.length === 0 ? (
            <p className="text-sm text-muted-foreground">No milestones yet</p>
          ) : (
            <div className="space-y-2">
              {milestones.map((m) => (
                <MilestoneCard
                  key={m.id}
                  milestone={m}
                  onStatusChange={(mid, s) => updateMilestoneStatus.mutate({ id: mid, status: s })}
                  onEdit={(ms) => { setEditMilestone(ms); setMilestoneOpen(true) }}
                  onDelete={(mid) => deleteMilestone.mutate(mid)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tasks */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Tasks</CardTitle>
          <Button size="sm" onClick={() => setNewTaskOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Task
          </Button>
        </CardHeader>
        <CardContent>
          <TaskList
            tasks={tasksData?.data ?? []}
            onStatusChange={(tid, s) => updateTaskStatus.mutate({ id: tid, status: s })}
          />
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Notes</CardTitle>
          <Button size="sm" onClick={() => { setEditNote(null); setNoteOpen(true) }}>
            <Plus className="mr-2 h-4 w-4" /> Add Note
          </Button>
        </CardHeader>
        <CardContent>
          {!notes || notes.length === 0 ? (
            <p className="text-sm text-muted-foreground">No notes yet</p>
          ) : (
            <div className="space-y-2">
              {notes.map((n) => (
                <NoteCard
                  key={n.id}
                  note={n}
                  onEdit={(note) => { setEditNote(note); setNoteOpen(true) }}
                  onDelete={(nid) => deleteNote.mutate(nid)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Commits */}
      {project.repo_url && commits && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Recent Commits</CardTitle>
          </CardHeader>
          <CardContent>
            <CommitList commits={commits} />
          </CardContent>
        </Card>
      )}

      {/* Dialogs */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Project</DialogTitle></DialogHeader>
          <ProjectForm
            initial={project}
            onSubmit={(d) => updateProject.mutate({ id: projectId, data: d }, { onSuccess: () => setEditOpen(false) })}
            isPending={updateProject.isPending}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={newTaskOpen} onOpenChange={setNewTaskOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>New Task</DialogTitle></DialogHeader>
          <TaskForm
            defaultProjectId={projectId}
            onSubmit={(d) => createTask.mutate(d, { onSuccess: () => setNewTaskOpen(false) })}
            isPending={createTask.isPending}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={milestoneOpen} onOpenChange={setMilestoneOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editMilestone ? 'Edit Milestone' : 'New Milestone'}</DialogTitle></DialogHeader>
          <MilestoneForm
            initial={editMilestone ?? undefined}
            onSubmit={(d) => {
              if (editMilestone) {
                updateMilestone.mutate({ id: editMilestone.id, data: d }, { onSuccess: () => setMilestoneOpen(false) })
              } else {
                createMilestone.mutate({ projectId, data: d }, { onSuccess: () => setMilestoneOpen(false) })
              }
            }}
            isPending={createMilestone.isPending || updateMilestone.isPending}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={noteOpen} onOpenChange={setNoteOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editNote ? 'Edit Note' : 'New Note'}</DialogTitle></DialogHeader>
          <NoteForm
            initial={editNote ?? undefined}
            onSubmit={(d) => {
              if (editNote) {
                updateNote.mutate({ id: editNote.id, data: d }, { onSuccess: () => setNoteOpen(false) })
              } else {
                createNote.mutate({ projectId, data: d }, { onSuccess: () => setNoteOpen(false) })
              }
            }}
            isPending={createNote.isPending || updateNote.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
