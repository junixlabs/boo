import { Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Reflection } from '../types'

interface ReflectionCardProps {
  reflection: Reflection
  onEdit: (reflection: Reflection) => void
  onDelete: (id: number) => void
}

export function ReflectionCard({ reflection, onEdit, onDelete }: ReflectionCardProps) {
  return (
    <div className="rounded-md border p-4 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant={{ weekly: 'default' as const, monthly: 'secondary' as const }[reflection.type]}>
            {{ weekly: 'Weekly', monthly: 'Monthly' }[reflection.type]}
          </Badge>
          <span className="text-sm text-muted-foreground">{reflection.period_start} — {reflection.period_end}</span>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(reflection)}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onDelete(reflection.id)}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      {reflection.went_well && <Section label="Went well" text={reflection.went_well} />}
      {reflection.went_wrong && <Section label="Went wrong" text={reflection.went_wrong} />}
      {reflection.to_improve && <Section label="To improve" text={reflection.to_improve} />}
    </div>
  )
}

function Section({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="text-sm whitespace-pre-wrap line-clamp-3">{text}</p>
    </div>
  )
}
