import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { Milestone, MilestonePayload } from '../types'

interface MilestoneFormProps {
  initial?: Milestone
  onSubmit: (data: MilestonePayload) => void
  isPending?: boolean
}

export function MilestoneForm({ initial, onSubmit, isPending }: MilestoneFormProps) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [targetDate, setTargetDate] = useState(initial?.target_date ?? '')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit({
      title,
      description: description || null,
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
      <div className="space-y-2">
        <Label htmlFor="target_date">Target Date</Label>
        <Input id="target_date" type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Saving...' : initial ? 'Update Milestone' : 'Create Milestone'}
      </Button>
    </form>
  )
}
