import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Reflection, ReflectionPayload, ReflectionType } from '../types'

interface ReflectionFormProps {
  initial?: Reflection
  onSubmit: (data: ReflectionPayload) => void
  isPending?: boolean
}

export function ReflectionForm({ initial, onSubmit, isPending }: ReflectionFormProps) {
  const [type, setType] = useState<ReflectionType>(initial?.type ?? 'weekly')
  const [periodStart, setPeriodStart] = useState(initial?.period_start ?? '')
  const [periodEnd, setPeriodEnd] = useState(initial?.period_end ?? '')
  const [wentWell, setWentWell] = useState(initial?.went_well ?? '')
  const [wentWrong, setWentWrong] = useState(initial?.went_wrong ?? '')
  const [toImprove, setToImprove] = useState(initial?.to_improve ?? '')
  const [projectsProgress, setProjectsProgress] = useState(initial?.projects_progress ?? '')
  const [skillsImproved, setSkillsImproved] = useState(initial?.skills_improved ?? '')
  const [mistakes, setMistakes] = useState(initial?.mistakes ?? '')
  const [opportunities, setOpportunities] = useState(initial?.opportunities ?? '')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit({
      type,
      period_start: periodStart,
      period_end: periodEnd,
      went_well: wentWell || null,
      went_wrong: wentWrong || null,
      to_improve: toImprove || null,
      projects_progress: projectsProgress || null,
      skills_improved: skillsImproved || null,
      mistakes: mistakes || null,
      opportunities: opportunities || null,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Type *</Label>
          <Select value={type} onValueChange={(v) => setType(v as ReflectionType)} disabled={!!initial}>
            <SelectTrigger><SelectValue>{{ weekly: 'Weekly', monthly: 'Monthly' }[type]}</SelectValue></SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="period_start">Period Start *</Label>
          <Input id="period_start" type="date" value={periodStart} onChange={(e) => setPeriodStart(e.target.value)} required disabled={!!initial} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="period_end">Period End *</Label>
          <Input id="period_end" type="date" value={periodEnd} onChange={(e) => setPeriodEnd(e.target.value)} required disabled={!!initial} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="went_well">What went well?</Label>
        <Textarea id="went_well" value={wentWell} onChange={(e) => setWentWell(e.target.value)} rows={2} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="went_wrong">What went wrong?</Label>
        <Textarea id="went_wrong" value={wentWrong} onChange={(e) => setWentWrong(e.target.value)} rows={2} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="to_improve">What to improve?</Label>
        <Textarea id="to_improve" value={toImprove} onChange={(e) => setToImprove(e.target.value)} rows={2} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="projects_progress">Projects progress</Label>
          <Textarea id="projects_progress" value={projectsProgress} onChange={(e) => setProjectsProgress(e.target.value)} rows={2} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="skills_improved">Skills improved</Label>
          <Textarea id="skills_improved" value={skillsImproved} onChange={(e) => setSkillsImproved(e.target.value)} rows={2} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="mistakes">Mistakes</Label>
          <Textarea id="mistakes" value={mistakes} onChange={(e) => setMistakes(e.target.value)} rows={2} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="opportunities">Opportunities</Label>
          <Textarea id="opportunities" value={opportunities} onChange={(e) => setOpportunities(e.target.value)} rows={2} />
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Saving...' : initial ? 'Update Reflection' : 'Create Reflection'}
      </Button>
    </form>
  )
}
