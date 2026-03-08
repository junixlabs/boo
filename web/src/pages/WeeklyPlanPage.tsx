import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/common/PageHeader'
import { PageLoading } from '@/components/common/LoadingSpinner'
import { WeeklyPlanView } from '@/features/weekly-plans/components/WeeklyPlanView'
import { useWeeklyPlan, useCreateWeeklyPlan, useUpdateWeeklyPlan } from '@/features/weekly-plans/hooks/useWeeklyPlans'

function getMonday(date: Date): string {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  return d.toISOString().split('T')[0]
}

function shiftWeek(weekStart: string, delta: number): string {
  const d = new Date(weekStart)
  d.setDate(d.getDate() + delta * 7)
  return d.toISOString().split('T')[0]
}

export default function WeeklyPlanPage() {
  const [weekStart, setWeekStart] = useState(() => getMonday(new Date()))
  const { data, isLoading } = useWeeklyPlan(weekStart)
  const createPlan = useCreateWeeklyPlan()
  const updatePlan = useUpdateWeeklyPlan()

  const weekEnd = shiftWeek(weekStart, 1)
  const endDate = new Date(weekEnd)
  endDate.setDate(endDate.getDate() - 1)
  const label = `${weekStart} — ${endDate.toISOString().split('T')[0]}`

  return (
    <div className="space-y-6">
      <PageHeader title="Weekly Planning" description="Reflect on your week and plan ahead" />
      <div className="flex items-center justify-center gap-3">
        <Button variant="outline" size="icon" onClick={() => setWeekStart(shiftWeek(weekStart, -1))}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium w-52 text-center">{label}</span>
        <Button variant="outline" size="icon" onClick={() => setWeekStart(shiftWeek(weekStart, 1))}>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setWeekStart(getMonday(new Date()))}>
          Today
        </Button>
      </div>
      {isLoading || !data ? (
        <PageLoading />
      ) : (
        <WeeklyPlanView
          data={data}
          weekStart={weekStart}
          onCreate={(d) => createPlan.mutate(d)}
          onUpdate={(id, d) => updatePlan.mutate({ id, data: d })}
          isPending={createPlan.isPending || updatePlan.isPending}
        />
      )}
    </div>
  )
}
