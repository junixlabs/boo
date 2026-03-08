import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { ProjectNote, ProjectNotePayload } from '../types'

interface NoteFormProps {
  initial?: ProjectNote
  onSubmit: (data: ProjectNotePayload) => void
  isPending?: boolean
}

export function NoteForm({ initial, onSubmit, isPending }: NoteFormProps) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [content, setContent] = useState(initial?.content ?? '')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit({ title, content })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="content">Content *</Label>
        <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows={6} required />
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Saving...' : initial ? 'Update Note' : 'Create Note'}
      </Button>
    </form>
  )
}
