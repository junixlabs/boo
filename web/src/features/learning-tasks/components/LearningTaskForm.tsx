import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { LearningTask, LearningTaskPayload } from '../types'

interface LearningTaskFormProps {
  initial?: LearningTask
  onSubmit: (data: LearningTaskPayload) => void
  isPending?: boolean
}

export function LearningTaskForm({ initial, onSubmit, isPending }: LearningTaskFormProps) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [resourceUrl, setResourceUrl] = useState(initial?.resource_url ?? '')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit({
      title,
      description: description || null,
      resource_url: resourceUrl || null,
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
        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="resource_url">Resource URL</Label>
        <Input id="resource_url" type="url" value={resourceUrl} onChange={(e) => setResourceUrl(e.target.value)} placeholder="https://..." />
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Saving...' : initial ? 'Update' : 'Add Learning Task'}
      </Button>
    </form>
  )
}
