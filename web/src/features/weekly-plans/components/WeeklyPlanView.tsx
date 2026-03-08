import { useState } from 'react'
import { Pencil, Check, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import type { WeeklyPlanIndex } from '../types'

interface WeeklyPlanViewProps {
  data: WeeklyPlanIndex
  weekStart: string
  onCreate: (data: { week_start: string; completed_summary?: string; blocked_summary?: string; next_summary?: string }) => void
  onUpdate: (id: number, data: { completed_summary?: string | null; blocked_summary?: string | null; next_summary?: string | null }) => void
  isPending?: boolean
}

export function WeeklyPlanView({ data, weekStart, onCreate, onUpdate, isPending }: WeeklyPlanViewProps) {
  const plan = data.plan
  const [editing, setEditing] = useState(!plan)
  const [completed, setCompleted] = useState(plan?.completed_summary ?? '')
  const [blocked, setBlocked] = useState(plan?.blocked_summary ?? '')
  const [next, setNext] = useState(plan?.next_summary ?? '')

  function handleSave() {
    if (plan) {
      onUpdate(plan.id, {
        completed_summary: completed || null,
        blocked_summary: blocked || null,
        next_summary: next || null,
      })
    } else {
      onCreate({
        week_start: weekStart,
        completed_summary: completed || undefined,
        blocked_summary: blocked || undefined,
        next_summary: next || undefined,
      })
    }
    setEditing(false)
  }

  function handleCancel() {
    setCompleted(plan?.completed_summary ?? '')
    setBlocked(plan?.blocked_summary ?? '')
    setNext(plan?.next_summary ?? '')
    setEditing(false)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-base">Weekly Plan</CardTitle>
          {!editing && (
            <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
              <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {editing ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">What did you complete?</p>
                <Textarea value={completed} onChange={(e) => setCompleted(e.target.value)} rows={3} placeholder="Summarize completed work..." />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">What blocked you?</p>
                <Textarea value={blocked} onChange={(e) => setBlocked(e.target.value)} rows={3} placeholder="Any blockers or challenges..." />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">What's next?</p>
                <Textarea value={next} onChange={(e) => setNext(e.target.value)} rows={3} placeholder="Plans for next week..." />
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSave} disabled={isPending}>
                  <Check className="mr-1 h-3.5 w-3.5" /> {plan ? 'Update' : 'Create'}
                </Button>
                {plan && (
                  <Button size="sm" variant="outline" onClick={handleCancel}>
                    <X className="mr-1 h-3.5 w-3.5" /> Cancel
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Section label="Completed" content={plan?.completed_summary} />
              <Section label="Blocked" content={plan?.blocked_summary} />
              <Section label="Next" content={plan?.next_summary} />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            Tasks Completed This Week
            <Badge variant="secondary" className="ml-2">{data.tasks_completed_this_week.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.tasks_completed_this_week.length === 0 ? (
            <p className="text-sm text-muted-foreground">No tasks completed this week</p>
          ) : (
            <div className="space-y-1">
              {data.tasks_completed_this_week.map((t) => (
                <div key={t.id} className="flex items-center justify-between text-sm">
                  <span>{t.title}</span>
                  {t.project && <span className="text-xs text-muted-foreground">{t.project.title}</span>}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function Section({ label, content }: { label: string; content: string | null | undefined }) {
  return (
    <div>
      <p className="text-sm font-medium">{label}</p>
      <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
        {content || 'Not filled in yet'}
      </p>
    </div>
  )
}
