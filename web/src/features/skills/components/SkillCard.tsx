import { Pencil, Trash2, ChevronDown, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Skill, SkillLevel } from '../types'

const levelLabels: Record<SkillLevel, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  expert: 'Expert',
}

interface SkillCardProps {
  skill: Skill
  expanded?: boolean
  onToggle: () => void
  onEdit: (skill: Skill) => void
  onDelete: (id: number) => void
}

export function SkillCard({ skill, expanded, onToggle, onEdit, onDelete }: SkillCardProps) {
  return (
    <div className="rounded-md border">
      <div className="flex items-center gap-3 p-3 cursor-pointer" onClick={onToggle}>
        {expanded ? <ChevronDown className="h-4 w-4 shrink-0" /> : <ChevronRight className="h-4 w-4 shrink-0" />}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">{skill.name}</p>
            <Badge variant="outline" className="text-xs">{levelLabels[skill.current_level]}</Badge>
            <span className="text-xs text-muted-foreground">-&gt;</span>
            <Badge variant="secondary" className="text-xs">{levelLabels[skill.target_level]}</Badge>
          </div>
        </div>
        {skill.learning_tasks_count != null && (
          <span className="text-xs text-muted-foreground">{skill.learning_tasks_done_count ?? 0}/{skill.learning_tasks_count} tasks</span>
        )}
        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(skill)}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onDelete(skill.id)}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
