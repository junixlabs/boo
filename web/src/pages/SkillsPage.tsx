import { useState } from 'react'
import { Plus, GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/common/PageHeader'
import { PageLoading } from '@/components/common/LoadingSpinner'
import { EmptyState } from '@/components/common/EmptyState'
import { SkillCard } from '@/features/skills/components/SkillCard'
import { SkillForm } from '@/features/skills/components/SkillForm'
import { LearningTaskCard } from '@/features/learning-tasks/components/LearningTaskCard'
import { LearningTaskForm } from '@/features/learning-tasks/components/LearningTaskForm'
import { useSkillCategories, useCreateCategory, useDeleteCategory } from '@/features/skill-categories/hooks/useSkillCategories'
import { useSkills, useCreateSkill, useUpdateSkill, useDeleteSkill } from '@/features/skills/hooks/useSkills'
import { useLearningTasks, useCreateLearningTask, useUpdateLearningTask, useUpdateLearningTaskStatus, useDeleteLearningTask } from '@/features/learning-tasks/hooks/useLearningTasks'
import type { Skill } from '@/features/skills/types'
import type { LearningTask } from '@/features/learning-tasks/types'

export default function SkillsPage() {
  const { data: categories, isLoading: catLoading } = useSkillCategories()
  const { data: skills, isLoading: skillsLoading } = useSkills()

  const createCategory = useCreateCategory()
  const deleteCategory = useDeleteCategory()
  const createSkill = useCreateSkill()
  const updateSkill = useUpdateSkill()
  const deleteSkill = useDeleteSkill()
  const createLearningTask = useCreateLearningTask()
  const updateLearningTask = useUpdateLearningTask()
  const updateLearningTaskStatus = useUpdateLearningTaskStatus()
  const deleteLearningTask = useDeleteLearningTask()

  const [skillDialogOpen, setSkillDialogOpen] = useState(false)
  const [editSkill, setEditSkill] = useState<Skill | null>(null)
  const [expandedSkillId, setExpandedSkillId] = useState<number | null>(null)
  const [taskDialogOpen, setTaskDialogOpen] = useState(false)
  const [editTask, setEditTask] = useState<LearningTask | null>(null)
  const [taskSkillId, setTaskSkillId] = useState<number>(0)
  const [newCatName, setNewCatName] = useState('')

  if (catLoading || skillsLoading) return <PageLoading />

  const allCategories = categories ?? []
  const allSkills = skills ?? []

  return (
    <div className="space-y-6">
      <PageHeader
        title="Skills"
        description="Track your skill development"
        action={
          <Button onClick={() => { setEditSkill(null); setSkillDialogOpen(true) }}>
            <Plus className="mr-2 h-4 w-4" /> New Skill
          </Button>
        }
      />

      {/* Quick add category */}
      <div className="flex gap-2">
        <Input
          placeholder="New category name..."
          value={newCatName}
          onChange={(e) => setNewCatName(e.target.value)}
          className="w-60"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && newCatName.trim()) {
              createCategory.mutate({ name: newCatName.trim() })
              setNewCatName('')
            }
          }}
        />
        <Button
          variant="outline"
          size="sm"
          disabled={!newCatName.trim()}
          onClick={() => { createCategory.mutate({ name: newCatName.trim() }); setNewCatName('') }}
        >
          Add Category
        </Button>
      </div>

      {allCategories.length === 0 ? (
        <EmptyState icon={GraduationCap} title="No skill categories" description="Create a category first, then add skills" />
      ) : (
        allCategories.map((cat) => {
          const catSkills = allSkills.filter((s) => s.category_id === cat.id)
          return (
            <Card key={cat.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-base">{cat.name}</CardTitle>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => { setEditSkill(null); setSkillDialogOpen(true) }}>
                    <Plus className="mr-1 h-3.5 w-3.5" /> Skill
                  </Button>
                  {catSkills.length === 0 && (
                    <Button size="sm" variant="ghost" onClick={() => deleteCategory.mutate(cat.id)}>Delete</Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {catSkills.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No skills in this category</p>
                ) : (
                  <div className="space-y-2">
                    {catSkills.map((skill) => (
                      <div key={skill.id}>
                        <SkillCard
                          skill={skill}
                          expanded={expandedSkillId === skill.id}
                          onToggle={() => setExpandedSkillId(expandedSkillId === skill.id ? null : skill.id)}
                          onEdit={(s) => { setEditSkill(s); setSkillDialogOpen(true) }}
                          onDelete={(id) => deleteSkill.mutate(id)}
                        />
                        {expandedSkillId === skill.id && (
                          <ExpandedLearningTasks
                            skillId={skill.id}
                            onAdd={() => { setTaskSkillId(skill.id); setEditTask(null); setTaskDialogOpen(true) }}
                            onEdit={(t) => { setTaskSkillId(skill.id); setEditTask(t); setTaskDialogOpen(true) }}
                            onStatusChange={(id, status) => updateLearningTaskStatus.mutate({ id, status })}
                            onDelete={(id) => deleteLearningTask.mutate(id)}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })
      )}

      <Dialog open={skillDialogOpen} onOpenChange={setSkillDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editSkill ? 'Edit Skill' : 'New Skill'}</DialogTitle></DialogHeader>
          <SkillForm
            initial={editSkill ?? undefined}
            categories={allCategories}
            onSubmit={(d) => {
              if (editSkill) {
                updateSkill.mutate({ id: editSkill.id, data: d }, { onSuccess: () => setSkillDialogOpen(false) })
              } else {
                createSkill.mutate(d, { onSuccess: () => setSkillDialogOpen(false) })
              }
            }}
            isPending={createSkill.isPending || updateSkill.isPending}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editTask ? 'Edit Learning Task' : 'New Learning Task'}</DialogTitle></DialogHeader>
          <LearningTaskForm
            initial={editTask ?? undefined}
            onSubmit={(d) => {
              if (editTask) {
                updateLearningTask.mutate({ id: editTask.id, data: d }, { onSuccess: () => setTaskDialogOpen(false) })
              } else {
                createLearningTask.mutate({ skillId: taskSkillId, data: d }, { onSuccess: () => setTaskDialogOpen(false) })
              }
            }}
            isPending={createLearningTask.isPending || updateLearningTask.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ExpandedLearningTasks({
  skillId, onAdd, onEdit, onStatusChange, onDelete,
}: {
  skillId: number
  onAdd: () => void
  onEdit: (t: LearningTask) => void
  onStatusChange: (id: number, status: LearningTask['status']) => void
  onDelete: (id: number) => void
}) {
  const { data: tasks } = useLearningTasks(skillId)

  return (
    <div className="ml-8 mt-2 space-y-1">
      {(tasks ?? []).map((t) => (
        <LearningTaskCard key={t.id} task={t} onStatusChange={onStatusChange} onEdit={onEdit} onDelete={onDelete} />
      ))}
      <Button variant="ghost" size="sm" className="text-xs" onClick={onAdd}>
        <Plus className="mr-1 h-3 w-3" /> Add Learning Task
      </Button>
    </div>
  )
}
