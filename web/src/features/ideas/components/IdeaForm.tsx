import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { IdeaPayload } from '../types'

interface IdeaFormProps {
  onSubmit: (data: IdeaPayload) => void
  isPending?: boolean
}

export function IdeaForm({ onSubmit, isPending }: IdeaFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit({ title, description: description || null, category: category || null })
    setTitle('')
    setDescription('')
    setCategory('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input placeholder="What's your idea?" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <Textarea placeholder="Details (optional)" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
      <div className="flex gap-2">
        <Input placeholder="Category (optional)" value={category} onChange={(e) => setCategory(e.target.value)} className="flex-1" />
        <Button type="submit" disabled={isPending}>{isPending ? 'Adding...' : 'Add Idea'}</Button>
      </div>
    </form>
  )
}
