import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Skill, SkillPayload, SkillLevel } from '../types'
import type { SkillCategory } from '@/features/skill-categories/types'

const levelLabels: Record<SkillLevel, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  expert: 'Expert',
}

interface SkillFormProps {
  initial?: Skill
  categories: SkillCategory[]
  onSubmit: (data: SkillPayload) => void
  isPending?: boolean
}

export function SkillForm({ initial, categories, onSubmit, isPending }: SkillFormProps) {
  const [name, setName] = useState(initial?.name ?? '')
  const [categoryId, setCategoryId] = useState(String(initial?.category_id ?? (categories[0]?.id ?? '')))
  const [currentLevel, setCurrentLevel] = useState<SkillLevel>(initial?.current_level ?? 'beginner')
  const [targetLevel, setTargetLevel] = useState<SkillLevel>(initial?.target_level ?? 'intermediate')
  const [notes, setNotes] = useState(initial?.notes ?? '')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit({
      category_id: Number(categoryId),
      name,
      current_level: currentLevel,
      target_level: targetLevel,
      notes: notes || null,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label>Category *</Label>
        <Select value={categoryId} onValueChange={(v) => setCategoryId(v ?? categoryId)}>
          <SelectTrigger><SelectValue>{categories.find(c => String(c.id) === categoryId)?.name ?? 'Select'}</SelectValue></SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Current Level</Label>
          <Select value={currentLevel} onValueChange={(v) => setCurrentLevel(v as SkillLevel)}>
            <SelectTrigger><SelectValue>{levelLabels[currentLevel]}</SelectValue></SelectTrigger>
            <SelectContent>
              {Object.entries(levelLabels).map(([v, l]) => (
                <SelectItem key={v} value={v}>{l}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Target Level</Label>
          <Select value={targetLevel} onValueChange={(v) => setTargetLevel(v as SkillLevel)}>
            <SelectTrigger><SelectValue>{levelLabels[targetLevel]}</SelectValue></SelectTrigger>
            <SelectContent>
              {Object.entries(levelLabels).map(([v, l]) => (
                <SelectItem key={v} value={v}>{l}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Saving...' : initial ? 'Update Skill' : 'Create Skill'}
      </Button>
    </form>
  )
}
