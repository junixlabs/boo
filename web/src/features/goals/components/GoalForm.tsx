import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Goal, GoalPayload, GoalTimeframe, GoalStatus } from '../types'

interface GoalFormProps {
  initial?: Goal
  onSubmit: (data: GoalPayload) => void
  isPending?: boolean
}

export function GoalForm({ initial, onSubmit, isPending }: GoalFormProps) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [timeframe, setTimeframe] = useState<GoalTimeframe>(initial?.timeframe ?? 'quarterly')
  const [status, setStatus] = useState<GoalStatus>(initial?.status ?? 'active')
  const [targetDate, setTargetDate] = useState(initial?.target_date ?? '')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit({
      title,
      description: description || null,
      timeframe,
      status,
      target_date: targetDate || null,
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
          <Label>Timeframe *</Label>
          <Select value={timeframe} onValueChange={(v) => setTimeframe(v as GoalTimeframe)}>
            <SelectTrigger><SelectValue>{{ yearly: 'Yearly', quarterly: 'Quarterly' }[timeframe]}</SelectValue></SelectTrigger>
            <SelectContent>
              <SelectItem value="yearly">Yearly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as GoalStatus)}>
            <SelectTrigger><SelectValue>{{ active: 'Active', completed: 'Completed', dropped: 'Dropped' }[status]}</SelectValue></SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="dropped">Dropped</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="target_date">Target Date</Label>
        <Input id="target_date" type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Saving...' : initial ? 'Update Goal' : 'Create Goal'}
      </Button>
    </form>
  )
}
