import { useState } from 'react'
import { Plus, Goal, Crosshair } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PageHeader } from '@/components/common/PageHeader'
import { PageLoading } from '@/components/common/LoadingSpinner'
import { EmptyState } from '@/components/common/EmptyState'
import { VisionEditor } from '@/features/life-direction/components/VisionEditor'
import { useLifeDirection, useUpdateVision } from '@/features/life-direction/hooks/useLifeDirection'
import { GoalCard } from '@/features/goals/components/GoalCard'
import { GoalForm } from '@/features/goals/components/GoalForm'
import { useCreateGoal, useUpdateGoal, useDeleteGoal } from '@/features/goals/hooks/useGoals'
import { FocusAreaCard } from '@/features/focus-areas/components/FocusAreaCard'
import { FocusAreaForm } from '@/features/focus-areas/components/FocusAreaForm'
import { useCreateFocusArea, useUpdateFocusArea, useDeleteFocusArea } from '@/features/focus-areas/hooks/useFocusAreas'
import type { Goal as GoalType, GoalTimeframe, GoalStatus } from '@/features/goals/types'
import type { FocusArea } from '@/features/focus-areas/types'

export default function LifeDirectionPage() {
  const { data, isLoading } = useLifeDirection()
  const updateVision = useUpdateVision()

  const createGoal = useCreateGoal()
  const updateGoal = useUpdateGoal()
  const deleteGoal = useDeleteGoal()

  const createFocusArea = useCreateFocusArea()
  const updateFocusArea = useUpdateFocusArea()
  const deleteFocusArea = useDeleteFocusArea()

  const [goalDialogOpen, setGoalDialogOpen] = useState(false)
  const [editGoal, setEditGoal] = useState<GoalType | null>(null)
  const [goalTimeframe, setGoalTimeframe] = useState<GoalTimeframe | 'all'>('all')
  const [goalStatus, setGoalStatus] = useState<GoalStatus | 'all'>('active')

  const [focusAreaDialogOpen, setFocusAreaDialogOpen] = useState(false)
  const [editFocusArea, setEditFocusArea] = useState<FocusArea | null>(null)

  if (isLoading || !data) return <PageLoading />

  const filteredGoals = data.goals.filter((g) => {
    if (goalTimeframe !== 'all' && g.timeframe !== goalTimeframe) return false
    if (goalStatus !== 'all' && g.status !== goalStatus) return false
    return true
  })

  return (
    <div className="space-y-6">
      <PageHeader title="Life Direction" description="Your vision, goals, and focus areas" />

      <Card>
        <CardHeader><CardTitle className="text-base">Vision</CardTitle></CardHeader>
        <CardContent>
          <VisionEditor
            vision={data.vision}
            onSave={(vision) => updateVision.mutate({ vision })}
            isPending={updateVision.isPending}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-base">Goals</CardTitle>
          <Button size="sm" onClick={() => { setEditGoal(null); setGoalDialogOpen(true) }}>
            <Plus className="mr-1 h-3.5 w-3.5" /> Add Goal
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-3 flex gap-2">
            <Select value={goalTimeframe} onValueChange={(v) => setGoalTimeframe(v as GoalTimeframe | 'all')}>
              <SelectTrigger className="w-32"><SelectValue>{{ all: 'All', yearly: 'Yearly', quarterly: 'Quarterly' }[goalTimeframe]}</SelectValue></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
              </SelectContent>
            </Select>
            <Select value={goalStatus} onValueChange={(v) => setGoalStatus(v as GoalStatus | 'all')}>
              <SelectTrigger className="w-32"><SelectValue>{{ all: 'All', active: 'Active', completed: 'Completed', dropped: 'Dropped' }[goalStatus]}</SelectValue></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="dropped">Dropped</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {filteredGoals.length === 0 ? (
            <EmptyState icon={Goal} title="No goals" description="Add your first goal" />
          ) : (
            <div className="space-y-2">
              {filteredGoals.map((g) => (
                <GoalCard
                  key={g.id}
                  goal={g}
                  onEdit={(goal) => { setEditGoal(goal); setGoalDialogOpen(true) }}
                  onDelete={(id) => deleteGoal.mutate(id)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-base">Focus Areas</CardTitle>
          <Button size="sm" onClick={() => { setEditFocusArea(null); setFocusAreaDialogOpen(true) }}>
            <Plus className="mr-1 h-3.5 w-3.5" /> Add Focus Area
          </Button>
        </CardHeader>
        <CardContent>
          {data.focus_areas.length === 0 ? (
            <EmptyState icon={Crosshair} title="No focus areas" description="Define your focus areas" />
          ) : (
            <div className="space-y-2">
              {data.focus_areas.map((a) => (
                <FocusAreaCard
                  key={a.id}
                  area={a}
                  onEdit={(area) => { setEditFocusArea(area); setFocusAreaDialogOpen(true) }}
                  onToggle={(id, isActive) => updateFocusArea.mutate({ id, data: { is_active: isActive } })}
                  onDelete={(id) => deleteFocusArea.mutate(id)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={goalDialogOpen} onOpenChange={setGoalDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editGoal ? 'Edit Goal' : 'New Goal'}</DialogTitle></DialogHeader>
          <GoalForm
            initial={editGoal ?? undefined}
            onSubmit={(d) => {
              if (editGoal) {
                updateGoal.mutate({ id: editGoal.id, data: d }, { onSuccess: () => setGoalDialogOpen(false) })
              } else {
                createGoal.mutate(d, { onSuccess: () => setGoalDialogOpen(false) })
              }
            }}
            isPending={createGoal.isPending || updateGoal.isPending}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={focusAreaDialogOpen} onOpenChange={setFocusAreaDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editFocusArea ? 'Edit Focus Area' : 'New Focus Area'}</DialogTitle></DialogHeader>
          <FocusAreaForm
            initial={editFocusArea ?? undefined}
            onSubmit={(d) => {
              if (editFocusArea) {
                updateFocusArea.mutate({ id: editFocusArea.id, data: d }, { onSuccess: () => setFocusAreaDialogOpen(false) })
              } else {
                createFocusArea.mutate(d, { onSuccess: () => setFocusAreaDialogOpen(false) })
              }
            }}
            isPending={createFocusArea.isPending || updateFocusArea.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
