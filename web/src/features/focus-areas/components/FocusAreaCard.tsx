import { Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { FocusArea } from '../types'

interface FocusAreaCardProps {
  area: FocusArea
  onEdit: (area: FocusArea) => void
  onToggle: (id: number, isActive: boolean) => void
  onDelete: (id: number) => void
}

export function FocusAreaCard({ area, onEdit, onToggle, onDelete }: FocusAreaCardProps) {
  return (
    <div className={`flex items-start gap-3 rounded-md border p-3 ${!area.is_active ? 'opacity-60' : ''}`}>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">{area.title}</p>
          <Badge variant={area.is_active ? 'default' : 'secondary'}>
            {area.is_active ? 'Active' : 'Inactive'}
          </Badge>
        </div>
        {area.description && <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{area.description}</p>}
      </div>
      <div className="flex gap-1">
        <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => onToggle(area.id, !area.is_active)}>
          {area.is_active ? 'Deactivate' : 'Activate'}
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(area)}>
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onDelete(area.id)}>
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}
